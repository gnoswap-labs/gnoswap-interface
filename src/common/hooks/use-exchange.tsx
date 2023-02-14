import { TokenDefaultModel } from "@/models/token/token-default-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { TokenState } from "@/states";
import BigNumber from "bignumber.js";
import { useRecoilState } from "recoil";
import { metaInfoToConfig, toDefaultDenom } from "../utils/denom-util";
import { useTokenResource } from "./use-token-resource";

export const useExchange = () => {
	const { getMetaInfo } = useTokenResource();

	const [standard] = useRecoilState(TokenState.standard);
	const [usdRate] = useRecoilState(TokenState.usdRate);
	const [exchangeRates] = useRecoilState(TokenState.exchangeRates);

	const exchangeToken = (from: TokenDefaultModel, to: TokenDefaultModel) => {
		const exchangeRate = getExchangeRate(from, to);
		const fromToken = convertToDefaultDenom(from);
		const toToken = convertToDefaultDenom(to);
		if (!fromToken || !toToken) {
			return null;
		}

		const exchangeAmount =
			fromToken.amount.value.multipliedBy(exchangeRate) ?? BigNumber(0);
		return {
			...toToken,
			amount: {
				value: exchangeAmount,
				denom: toToken.amount.denom,
			},
		};
	};

	const tokenToUSD = (token: TokenDefaultModel) => {
		const defaultToken = convertToDefaultDenom(token);
		if (!defaultToken) {
			return BigNumber(0);
		}
		const standardExchangeRate = getExchangeRateFromStandard(defaultToken);
		if (!standardExchangeRate || !usdRate || !defaultToken.amount) {
			return BigNumber(0);
		}
		const tokenAmount = defaultToken.amount.value;
		return tokenAmount.multipliedBy(standardExchangeRate).multipliedBy(usdRate);
	};

	const tokenPairToUSD = (tokenPair: TokenPairModel) => {
		const token0USDValue = tokenToUSD(tokenPair.token0);
		const token1USDValue = tokenToUSD(tokenPair.token1);
		return token0USDValue.plus(token1USDValue);
	};

	const convertToDefaultDenom = (token: TokenDefaultModel) => {
		const { tokenId, amount } = token;
		const metaInfo = getMetaInfo(tokenId);
		if (!amount || !metaInfo || !usdRate) {
			return null;
		}

		const tokenDefaultAmount = toDefaultDenom(
			amount,
			metaInfoToConfig(metaInfo),
		);
		return {
			...token,
			amount: tokenDefaultAmount,
		};
	};

	const getExchangeRateFromStandard = (token: TokenDefaultModel) => {
		const standardTokenId = standard?.token_id ?? "1";
		const standardRate = exchangeRates.find(
			rate => rate.tokenId === standardTokenId,
		);
		const tokenRate = exchangeRates.find(
			rate => rate.tokenId === token.tokenId,
		);
		if (!standardRate || !tokenRate) {
			return BigNumber(1);
		}
		return tokenRate.rate.dividedBy(standardRate.rate);
	};

	const getExchangeRate = (from: TokenDefaultModel, to: TokenDefaultModel) => {
		const fromRate = getExchangeRateFromStandard(from);
		const toRate = getExchangeRateFromStandard(to);
		return fromRate.dividedBy(toRate);
	};

	return {
		usdRate,
		exchangeRates,
		getExchangeRate,
		exchangeToken,
		tokenToUSD,
		tokenPairToUSD,
	};
};
