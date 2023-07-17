import { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import { SwapConfirmModel } from "@models/swap/swap-confirm-model";
import { SwapExpectedResultModel } from "@models/swap/swap-expected-result-model";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { ExactTypeOption } from "@common/values/data-constant";
import { useExchange } from "@hooks/token/use-exchange";
import { useRepository } from "@hooks/repository/use-repository";
import { SwapInfoRequest } from "@repositories/swap/request/swap-info-request";
import { SwapRateMapper } from "@models/swap/mapper/swap-rate-mapper";
import { SwapExpectedMapper } from "@models/swap/mapper/swap-expected-mapper";
import { SwapRequest } from "@repositories/swap/request";
import { SwapConfirmMapper } from "@models/swap/mapper/swap-confirm-mapper";

interface Props {
  token0: TokenDefaultModel | null;
  token1: TokenDefaultModel | null;
  swapType: ExactTypeOption;
}

export const useSwap = ({ token0, token1, swapType }: Props) => {
  const { swapRepository } = useRepository();
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

  const initSlippage = useCallback(() => {
    const slippage = swapRepository.getSlippage();
    setSlippage(slippage);
  }, [swapRepository]);

  const updateSlippage = useCallback(
    (slippage: number) => {
      swapRepository.setSlippage(slippage);
      setSlippage(slippage);
    },
    [swapRepository],
  );

  const updateSwappedTokens = useCallback(
    (swapRate: BigNumber | null) => {
      if (!token0 || !token1 || !swapRate) {
        return false;
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
      return true;
    },
    [exchangeTokenByRate, swapType, token0, token1],
  );

  const updateSwapRate = useCallback(() => {
    if (!token0 || !token1) {
      setSwapRate(null);
      return;
    }
    const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
      token0,
      token1,
      type: swapType,
    });
    swapRepository
      .getSwapRate(request)
      .then(response => {
        const swapRate = BigNumber(response.rate);
        setSwapRate(swapRate);
        return swapRate;
      })
      .then(updateSwappedTokens)
      .catch(() => setSwapRate(null));
  }, [swapRepository, swapType, token0, token1, updateSwappedTokens]);

  const updateSwapResult = useCallback(() => {
    if (!token0 || !token1) {
      return;
    }
    const request: SwapInfoRequest = SwapRateMapper.toRateRequest({
      token0,
      token1,
      type: swapType,
    });
    swapRepository
      .getExpectedSwapResult(request)
      .then(SwapExpectedMapper.fromExpectedResponse)
      .then(swapResult => setSwapResult(swapResult));
  }, [swapRepository, swapType, token0, token1]);

  const swap = useCallback(() => {
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
    const request: SwapRequest = SwapConfirmMapper.toConfirmRequest(swapRequest);
    return swapRepository.swap(request);
  }, [slippage, swapRepository, swapType, swappedToken0, swappedToken1]);

  return {
    swappedToken0,
    swappedToken1,
    slippage,
    swapRate,
    swapResult,
    initSlippage,
    updateSwapRate,
    updateSlippage,
    updateSwapResult,
    swap,
  };
};
