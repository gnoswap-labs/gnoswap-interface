import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { constructRequestError, extractSimulateFromResponse, Tm2Client, Tx } from "@gnolang/tm2-js-client";
import type { RpcClient } from "@gnolang/tm2-rpc";

import { GNOT_TOKEN } from "@common/values/token-constant";

import { FallbackRpcClient, RPC_REQUEST_TIMEOUT_MS } from "./fallback-rpc-client";
import { RpcEndpointSelector } from "./rpc-endpoint-selector";

const MIN_CONNECT_TIMEOUT_MS = 15_000;

export interface GnoProviderOptions {
  /** Optional second endpoint used once the primary one stops answering. */
  fallbackRpcUrl?: string;
  /** Bounds a single attempt against one endpoint, after which the next one is tried. */
  requestTimeoutMs?: number;
  /**
   * Bounds {@link GnoProvider.create} as a whole, across every endpoint.
   * Defaults to a budget wide enough for every endpoint to use its full
   * request timeout, so the fallback is never cut short by the primary's.
   */
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
    const { fallbackRpcUrl, requestTimeoutMs = RPC_REQUEST_TIMEOUT_MS } = options;

    const endpoints = new RpcEndpointSelector(baseURL, fallbackRpcUrl);
    const connectTimeoutMs =
      options.connectTimeoutMs ?? Math.max(MIN_CONNECT_TIMEOUT_MS, requestTimeoutMs * endpoints.count);
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

  /**
   * Returns the gas the tx uses when simulated.
   *
   * Replaces the tm2-js-client version (still as of 3.3.0), which base64 encodes the tx on
   * top of the RPC client's own encoding, so the node fails with "unable to decode tx".
   */
  public async estimateGas(tx: Tx): Promise<bigint> {
    const abciResponse = await this.abciQuery({
      path: ".app/simulate",
      data: Tx.encode(tx).finish(),
      height: 0,
      prove: false,
    });

    const simulateResult = extractSimulateFromResponse(abciResponse);
    const errorType = simulateResult.response_base?.error?.type_url;
    if (errorType) {
      throw constructRequestError(errorType, simulateResult.response_base?.log);
    }

    return BigInt(simulateResult.gas_used);
  }

  /**
   * Returns the chain gas price as ugnot per gas unit, or 0 when the node has none.
   *
   * tm2-js-client 3.3.0 returns the price as { amount, denom, gas }, so this keeps
   * the per gas number the fee calculation expects.
   */
  public async getUgnotPerGas(): Promise<number> {
    const gasPrice = await this.getGasPrice().catch(() => null);
    if (!gasPrice || gasPrice.denom !== (GNOT_TOKEN.denom || "ugnot")) {
      return 0;
    }

    return gasPrice.amount / gasPrice.gas;
  }
}
