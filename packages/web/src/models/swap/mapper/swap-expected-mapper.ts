import { SwapExpectedResultResponse } from "@repositories/swap";
import { SwapExpectedResultModel } from "@models/swap/swap-expected-result-model";
import BigNumber from "bignumber.js";

export class SwapExpectedMapper {
  public static fromExpectedResponse(
    response: SwapExpectedResultResponse,
  ): SwapExpectedResultModel {
    const { price_impact, min_received, gas_fee } = response;
    return {
      priceImpact: price_impact,
      minReceived: BigNumber(min_received),
      gasFee: BigNumber(gas_fee),
    };
  }
}
