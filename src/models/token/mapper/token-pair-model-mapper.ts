import { TokenInfoResponse } from "@/repositories/token";
import { TokenPairModel } from "../token-pair-model";
import { TokenModelMapper } from "./token-model-mapper";

interface TokenPairResponse {
	total: number;
	token0: TokenInfoResponse;
	token1: TokenInfoResponse;
}

export class TokenPairModelMapper {
	public static fromResposne(response: TokenPairResponse): TokenPairModel {
		const { token0, token1 } = response;

		return {
			token0: TokenModelMapper.fromResponse(token0),
			token1: TokenModelMapper.fromResponse(token1),
		};
	}

	public static toSimple(model: TokenPairModel) {
		const { token0, token1 } = model;

		return {
			token0: TokenModelMapper.toSimple(token0),
			token1: TokenModelMapper.toSimple(token1),
		};
	}
}
