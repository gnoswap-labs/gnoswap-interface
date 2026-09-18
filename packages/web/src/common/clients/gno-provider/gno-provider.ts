import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { adaptAbciQueryResponse, parseABCI } from "@gnolang/tm2-js-client";
import { RpcClient, Tm2Client } from "@gnolang/tm2-rpc";

import { parseTokenAmount } from "@utils/token-utils";

import { FallbackRpcClient } from "./fallback-rpc-client";
import { RpcEndpointSelector } from "./rpc-endpoint-selector";

const DEFAULT_CONNECT_TIMEOUT_MS = 15_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

export interface GnoProviderOptions {
  /** Optional second endpoint used once the primary one stops answering. */
  fallbackRpcUrl?: string;
  /** Bounds a single attempt against one endpoint, after which the next one is tried. */
  requestTimeoutMs?: number;
  /** Bounds {@link GnoProvider.create} as a whole, across every endpoint. */
  connectTimeoutMs?: number;
}

export class GnoProvider extends GnoJSONRPCProvider {
  /**
   * Connects to the node and creates a provider bound to it.
   * Since v3 the provider is built on top of a Tm2Client, so instantiation
   * requires a round trip to the node and can no longer be done synchronously.
   *
   * The round trip goes through the same failover as every later request, so a
   * dead primary endpoint is left behind here rather than at the first query.
   * The overall wait is bounded as well, so the caller always settles and can
   * surface a failure instead of hanging on a blackholed node.
   */
  public static async create(baseURL: string, options: GnoProviderOptions = {}): Promise<GnoProvider> {
    const {
      fallbackRpcUrl,
      requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
      connectTimeoutMs = DEFAULT_CONNECT_TIMEOUT_MS,
    } = options;

    const endpoints = new RpcEndpointSelector(baseURL, fallbackRpcUrl);
    const connecting = GnoProvider.connect(new FallbackRpcClient(endpoints, requestTimeoutMs));

    let timer: ReturnType<typeof setTimeout> | undefined;

    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Timed out connecting to the RPC node at ${baseURL}`)),
        connectTimeoutMs,
      );
    });

    try {
      return await Promise.race([connecting, deadline]);
    } finally {
      clearTimeout(timer);
    }
  }

  private static async connect(client: RpcClient): Promise<GnoProvider> {
    const tm2Client = await Tm2Client.create(client);

    // Unlike Tm2Client.connect, Tm2Client.create never touches the node, so a
    // provider would be handed out for an endpoint that is not answering at
    // all. The status query keeps that round trip, and since it runs through
    // the failover a dead primary endpoint is left behind here rather than at
    // the first query the app makes.
    await tm2Client.status();

    return new GnoProvider(tm2Client);
  }

  public async getGasPrice(height?: number | undefined): Promise<number> {
    const rpcResponse = await this.client
      .abciQuery({
        path: "auth/gasprice",
        data: new Uint8Array(),
        height: height ?? 0,
        prove: false,
      })
      .catch(() => null);

    const abciData = rpcResponse ? adaptAbciQueryResponse(rpcResponse).response.ResponseBase.Data : null;
    // Make sure the response is initialized
    if (!abciData) {
      return 0;
    }

    const gasPrice = parseABCI<{
      gas: number;
      price: string;
    }>(abciData);

    const priceAmount = parseTokenAmount(gasPrice.price);
    if (gasPrice.gas === 0 || priceAmount === 0) {
      return 0;
    }

    return priceAmount / gasPrice.gas;
  }
}
