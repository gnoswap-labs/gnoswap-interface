import { SwapError } from "@common/errors/swap/swap-error";
import { SwapRateModel } from "@models/swap/swap-rate-model";
import { notEmptyStringType } from "@common/utils/data-check-util";
import { SwapInfoRequest } from "@repositories/swap/request/swap-info-request";
import BigNumber from "bignumber.js";

export class SwapRateMapper {
  public static toRateRequest(request: SwapRateModel): SwapInfoRequest {
    const { token0, token1, type } = request;
    const formatResponse: SwapInfoRequest = {
      token0Amount: BigNumber(token0.amount?.value ?? 0).toString(),
      token0Symbol: token0.symbol,
      token1Amount: BigNumber(token1.amount?.value ?? 0).toString(),
      token1Symbol: token1.symbol,
      type,
    };
    if (
      !notEmptyStringType(formatResponse.token0Symbol) &&
      !notEmptyStringType(formatResponse.token1Symbol)
    ) {
      throw new SwapError("SYMBOL_TYPE_CHECK_ERROR");
    }
    if (
      !notEmptyStringType(formatResponse.token0Amount) &&
      !notEmptyStringType(formatResponse.token1Amount)
    ) {
      throw new SwapError("AMOUNT_TYPE_CHECK_ERROR");
    }

    return formatResponse;
  }
}
