import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { SwapExpectedResultModel } from "@/models/swap/swap-expected-result-model";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { isErrorResponse } from "../utils/validation-util";
import { ExactTypeOption } from "../values/data-constant";
import { useExchange } from "./use-exchange";
import { useGnoswapContext } from "./use-gnoswap-context";

interface Props {
	token0: TokenDefaultModel | null;
	token1: TokenDefaultModel | null;
	swapType: ExactTypeOption;
}

export const useSwap = ({ token0, token1, swapType }: Props) => {
	const { swapService } = useGnoswapContext();
	const { exchangeTokenByRate } = useExchange();

	const [swapRate, setSwapRate] = useState<BigNumber | null>(null);
	const [swapResult, setSwapResult] = useState<SwapExpectedResultModel>();
	const [swappedToken0, setSwappedToken0] = useState<TokenDefaultModel | null>(
		token0,
	);
	const [swappedToken1, setSwappedToken1] = useState<TokenDefaultModel | null>(
		token1,
	);
	const [slippage, setSlippage] = useState(0);

	useEffect(() => {
		initSlippage();
	}, []);

	useEffect(() => {
		updateSwapRate();
		updateSwapResult();
	}, [token0, token1, swapType]);

	const initSlippage = () => {
		const slippage = swapService.getSlippage();
		setSlippage(slippage);
	};

	const updateSlippage = (slippage: number) => {
		swapService.setSlippage(slippage);
		setSlippage(slippage);
	};

	const updateSwapRate = () => {
		if (!token0 || !token1) {
			setSwapRate(null);
			return;
		}
		swapService
			.getSwapRate(token0, token1, swapType)
			.then(response => {
				if (isErrorResponse(response)) {
					return null;
				}
				setSwapRate(response);
				return response;
			})
			.then(updateSwappedTokens)
			.catch(_ => setSwapRate(null));
	};

	const updateSwappedTokens = (swapRate: BigNumber | null) => {
		if (!token0 || !token1 || !swapRate) {
			return;
		}
		if (swapType === "EXACT_IN") {
			const swappedToken = exchangeTokenByRate(token0, token1, swapRate);
			setSwappedToken0(token0);
			setSwappedToken1(swappedToken);
		} else if (swapType === "EXACT_OUT") {
			const swappedToken = exchangeTokenByRate(token0, token1, swapRate);
			setSwappedToken0(swappedToken);
			setSwappedToken1(token1);
		}
	};

	const updateSwapResult = () => {
		if (!token0 || !token1) {
			return;
		}
		swapService
			.getExpectedSwapResult(token0, token1, swapType)
			.then(response => !isErrorResponse(response) && setSwapResult(response));
	};

	const swap = () => {
		if (!swappedToken0 || !swappedToken1) {
			return null;
		}
		const swapRequest: SwapConfirmModel = {
			tokenPair: {
				token0: swappedToken0,
				token1: swappedToken1,
			},
			type: swapType,
			slippage,
			gasFee: BigNumber(0), // TODO: swapResult.gasFee
		};
		return swapService.confirmSwap(swapRequest);
	};

	return {
		swappedToken0,
		swappedToken1,
		slippage,
		swapRate,
		swapResult,
		updateSlippage,
		updateSwapResult,
		swap,
	};
};
