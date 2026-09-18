import type { RpcClient } from "@gnolang/tm2-rpc";
import axios from "axios";

import { JsonRpcResponseError } from "./json-rpc-response-error";
import { RpcEndpointSelector } from "./rpc-endpoint-selector";

/** Bounds a single JSON-RPC call against one endpoint, after which the next one is tried. */
export const RPC_REQUEST_TIMEOUT_MS = 10_000;

type RpcRequest = Parameters<RpcClient["execute"]>[0];
type RpcSuccessResponse = Awaited<ReturnType<RpcClient["execute"]>>;

interface JsonRpcResponseBody {
  id?: RpcRequest["id"];
  result?: unknown;
  error?: { code?: number; message?: string };
}

function assertHasProtocol(endpoint: string): void {
  if (!/^https?:\/\//i.test(endpoint)) {
    throw new Error(`RPC endpoint URL is missing a protocol. Expected 'https://' or 'http://', got '${endpoint}'.`);
  }
}

/**
 * An `RpcClient` that spreads its requests over the endpoints of a
 * {@link RpcEndpointSelector}, so every call the provider makes - including the
 * ones the base `GnoJSONRPCProvider` issues through the `Tm2Client` - fails
 * over to the fallback RPC when the active endpoint stops answering.
 *
 * tm2-rpc's own `HttpClient` is not used as the transport: it passes no
 * AbortSignal and its `disconnect` is a no-op, so a blackholed node would hold
 * the request open forever with no way to give up on it, and the selector would
 * never see the failure it needs to rotate. Axios aborts on its own timeout,
 * and reports whether the endpoint answered at all, which is exactly the
 * distinction the selector rotates on.
 */
export class FallbackRpcClient implements RpcClient {
  private readonly endpoints: RpcEndpointSelector;

  private readonly requestTimeoutMs: number;

  constructor(endpoints: RpcEndpointSelector, requestTimeoutMs: number = RPC_REQUEST_TIMEOUT_MS) {
    endpoints.all.forEach(assertHasProtocol);
    this.endpoints = endpoints;
    this.requestTimeoutMs = requestTimeoutMs;
  }

  public execute = (request: RpcRequest): Promise<RpcSuccessResponse> => {
    return this.endpoints.run(endpoint => this.executeOn(endpoint, request));
  };

  // HTTP keeps no connection of its own to tear down, and an in-flight request
  // is already bounded by its timeout.
  public disconnect = (): void => undefined;

  private async executeOn(endpoint: string, request: RpcRequest): Promise<RpcSuccessResponse> {
    const { data } = await axios.post<JsonRpcResponseBody>(endpoint, request, {
      timeout: this.requestTimeoutMs,
    });

    if (data?.error) {
      throw new JsonRpcResponseError(data.error.message ?? JSON.stringify(data.error));
    }

    if (!data || data.result === undefined) {
      throw new JsonRpcResponseError(`Unexpected JSON-RPC response from ${endpoint}`);
    }

    return { jsonrpc: "2.0", id: data.id ?? request.id, result: data.result };
  }
}
