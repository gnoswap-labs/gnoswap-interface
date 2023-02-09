import { SwapError } from "@/common/errors/swap/swap-error";
import { SwapRateModel } from "../swap-rate-model";
import { notEmptyStringType } from "@/common/utils/data-check-util";
import { SwapInfoRequest } from "@/repositories/swap/request/swap-info-request";

export class SwapRateMapper {
	public static toRateRequest(model: SwapRateModel): SwapInfoRequest {
		const { token0Symbol, token0Amount, token1Symbol, token1Amount, type } =
			model;
		const formatAllString: SwapInfoRequest = {
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
