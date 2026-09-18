import { HttpClient, RpcClient } from "@gnolang/tm2-rpc";

import { RpcEndpointSelector } from "./rpc-endpoint-selector";

type RpcRequest = Parameters<HttpClient["execute"]>[0];
type RpcSuccessResponse = Awaited<ReturnType<HttpClient["execute"]>>;

/**
 * An `RpcClient` that spreads its requests over the endpoints of a
 * {@link RpcEndpointSelector}, so every call the provider makes - including the
 * ones the base `GnoJSONRPCProvider` issues through the `Tm2Client` - fails
 * over to the fallback RPC when the active endpoint stops answering.
 *
 * `HttpClient` passes no AbortSignal, so a blackholed node would hang forever
 * and never let the selector rotate; each attempt is bounded here instead. The
 * request itself keeps running until the browser drops it, what this guarantees
 * is that the caller always settles.
 */
export class FallbackRpcClient implements RpcClient {
  private readonly clients = new Map<string, HttpClient>();

  private readonly endpoints: RpcEndpointSelector;

  private readonly requestTimeoutMs: number;

  constructor(endpoints: RpcEndpointSelector, requestTimeoutMs: number) {
    this.endpoints = endpoints;
    this.requestTimeoutMs = requestTimeoutMs;
  }

  public execute = (request: RpcRequest): Promise<RpcSuccessResponse> => {
    return this.endpoints.run(endpoint => this.executeOn(endpoint, request));
  };

  public disconnect = (): void => {
    this.clients.forEach(client => client.disconnect());
  };

  private async executeOn(endpoint: string, request: RpcRequest): Promise<RpcSuccessResponse> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Timed out waiting for the RPC node at ${endpoint}`)),
        this.requestTimeoutMs,
      );
    });

    try {
      return await Promise.race([this.clientFor(endpoint).execute(request), deadline]);
    } finally {
      clearTimeout(timer);
    }
  }

  private clientFor(endpoint: string): HttpClient {
    const client = this.clients.get(endpoint) ?? new HttpClient(endpoint);
    this.clients.set(endpoint, client);
    return client;
  }
}
