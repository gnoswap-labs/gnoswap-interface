import { SwapConfirmModel } from "@/models/swap/swap-confirm-model";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { ExactTypeOption } from "../values/data-constant";
import { useGnoswapContext } from "./use-gnoswap-context";

interface Props {
	token0: TokenDefaultModel;
	token1: TokenDefaultModel;
	swapType: ExactTypeOption;
}

export const useSwap = ({ token0, token1, swapType }: Props) => {
	const { swapService } = useGnoswapContext();

	const [swapRate, setSwapRate] = useState(0);
	const [swapResult, setSwapResult] = useState(null);
	const [swappedToken0, setSwappedToken0] = useState(token0);
	const [swappedToken1, setSwappedToken1] = useState(token1);
	const [slippage, setSlippage] = useState(0);

	useEffect(() => {
		initSlippage();
	}, []);

	useEffect(() => {}, [token0, token1, swapType]);

	const initSlippage = () => {
		const slippage = swapService.getSlippage();
		setSlippage(slippage);
	};

	const updateSlippage = (slippage: number) => {
		swapService.setSlippage(slippage);
		setSlippage(slippage);
	};

	const updateSwapResult = () => {};

	const swap = () => {
		const swapRequest: SwapConfirmModel = {
			tokenPair: {
				token0: swappedToken0,
				token1: swappedToken1,
			},
			type: swapType,
			slippage,
			gasFee: BigNumber(0), // TODO: swapResult.gasFee
		};
		swapService.confirmSwap(swapRequest);
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
