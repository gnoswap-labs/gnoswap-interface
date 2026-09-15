import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { adaptAbciQueryResponse, parseABCI } from "@gnolang/tm2-js-client";
import { Tm2Client } from "@gnolang/tm2-rpc";

import { parseTokenAmount } from "@utils/token-utils";

const DEFAULT_CONNECT_TIMEOUT_MS = 15_000;

export class GnoProvider extends GnoJSONRPCProvider {
  /**
   * Connects to the node and creates a provider bound to it.
   * Since v3 the provider is built on top of a Tm2Client, so instantiation
   * requires a round trip to the node and can no longer be done synchronously.
   *
   * Tm2Client has no deadline of its own and its HTTP client passes no
   * AbortSignal, so the wait is bounded here. The request itself keeps running
   * until the browser drops it; what this guarantees is that the caller always
   * settles and can surface a failure instead of hanging on a blackholed node.
   */
  public static async create(baseURL: string, timeoutMs: number = DEFAULT_CONNECT_TIMEOUT_MS): Promise<GnoProvider> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out connecting to the RPC node at ${baseURL}`)), timeoutMs);
    });

    try {
      return new GnoProvider(await Promise.race([Tm2Client.connect(baseURL), deadline]));
    } finally {
      clearTimeout(timer);
    }
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
