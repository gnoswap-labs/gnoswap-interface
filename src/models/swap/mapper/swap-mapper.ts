import { SwapError } from "../../../common/errors/swap/swap-error";
import {
	SwapRateRequestModel,
	SwapRateResponseModel,
} from "../swap-rate-model";
import { notEmptyStringType } from "@/common/utils/data-check-util";
import { SwapExpectedResultResponse } from "@/repositories/swap";
import { SwapExpectedResultModel } from "../swap-expected-result-model";
import BigNumber from "bignumber.js";

export class SwapMapper {
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

	public static toRateRequest(
		response: SwapRateRequestModel,
	): SwapRateResponseModel {
		const { token0Symbol, token0Amount, token1Symbol, token1Amount, type } =
			response;
		const formatAllString = {
			token0Symbol,
			token0Amount: token0Amount.toString(),
			token1Symbol,
			token1Amount: token1Amount.toString(),
			type,
		};
		if (
			!notEmptyStringType(formatAllString.token0Symbol) &&
			!notEmptyStringType(formatAllString.token1Symbol)
		) {
			throw new SwapError("SYMBOL_TYPE_CHECK_ERROR");
		}
		if (
			!notEmptyStringType(formatAllString.token0Amount) &&
			!notEmptyStringType(formatAllString.token1Amount)
		) {
			throw new SwapError("AMOUNT_TYPE_CHECK_ERROR");
		}

		return formatAllString;
	}
}
