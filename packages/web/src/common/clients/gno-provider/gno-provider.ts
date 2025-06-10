import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { ABCIEndpoint, newRequest, parseABCI } from "@gnolang/tm2-js-client";

import { postABCIResponse } from "@utils/gno-utils";
import { parseTokenAmount } from "@utils/token-utils";

export class GnoProvider extends GnoJSONRPCProvider {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async getGasPrice(height?: number | undefined): Promise<number> {
    const requestBody = newRequest(ABCIEndpoint.ABCI_QUERY, ["auth/gasprice", "", `${height ?? 0}`, false]);

    const abciResponse = await postABCIResponse(this.baseURL, requestBody).catch(() => null);

    const abciData = abciResponse?.result?.response.ResponseBase.Data;
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
