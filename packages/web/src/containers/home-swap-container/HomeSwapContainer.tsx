import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import useRouter from "@hooks/common/use-custom-router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { formatUsdNumber } from "@utils/stake-position-utils";
import { isEmptyObject } from "@utils/validation-utils";
import { checkGnotPath } from "@utils/common";
import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, displayBalanceMap } = useTokenData();
  const [tokenA, setTokenA] = useState<TokenModel | null>(GNOT_TOKEN);
  const [tokenAAmount, setTokenAAmount] = useState<string>("");
  const [tokenB, setTokenB] = useState<TokenModel | null>(GNS_TOKEN);
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const { slippage } = useSlippage();
  const { connected, isSwitchNetwork } = useWallet();
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);

  const tokenABalance = useMemo(() => {
    if (!connected || isSwitchNetwork) return "-";
    if (tokenA && displayBalanceMap[tokenA.priceID]) {
      const balance = displayBalanceMap[tokenA.priceID] || 0;
      return BigNumber(balance).toFormat(tokenA.decimals);
    }
    if (isEmptyObject(displayBalanceMap)) {
      return "-";
    }
    return "0";
  }, [isSwitchNetwork, connected, displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (!connected || isSwitchNetwork) return "-";
    if (isEmptyObject(displayBalanceMap)) {
      return "-";
    }
    console.log("🚀 ~ tokenBBalance ~ displayBalanceMap:", displayBalanceMap);
    console.log("🚀 ~ tokenBBalance ~ tokenB:", tokenB);
    if (tokenB && displayBalanceMap[tokenB.priceID]) {
      const balance = displayBalanceMap[tokenB.priceID] || 0;
      return BigNumber(balance).toFormat(tokenB.decimals);
    }
    return "0";
  }, [isSwitchNetwork, connected, displayBalanceMap, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[checkGnotPath(tokenA.priceID)]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenA.priceID)].usd)
      .toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (
      !Number(tokenBAmount) ||
      !tokenB ||
      !tokenPrices[checkGnotPath(tokenB.priceID)]
    ) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenB.priceID)].usd)
      .toNumber();
  }, [tokenB, tokenBAmount, tokenPrices]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: formatUsdNumber(tokenAUSD.toString()),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: formatUsdNumber(tokenBUSD.toString()),
      direction: "EXACT_IN",
      slippage,
      tokenADecimals: tokenA?.decimals,
      tokenBDecimals: tokenB?.decimals,
    };
  }, [
    slippage,
    tokenA,
    tokenAAmount,
    tokenABalance,
    tokenAUSD,
    tokenB,
    tokenBAmount,
    tokenBBalance,
    tokenBUSD,
  ]);

  const swapNow = useCallback(() => {
    const direction = (() => {
      if (tokenAAmount) return "EXACT_IN";

      if (tokenBAmount) return "EXACT_OUT";

      return "EXACT_IN";
    })();

    const queries = [
      `from=${tokenA?.path}`,
      `to=${tokenB?.path}`,
      `direction=${direction}`,
      ...(tokenAAmount ? [`token_a_amount=${tokenAAmount}`] : []),
      ...(tokenBAmount ? [`token_b_amount=${tokenBAmount}`] : []),
    ];
    const queriesString = queries.join("&");
    if (!!tokenAAmount || !!tokenBAmount) {
      router.push(`/swap?${queriesString}`);
    }
  }, [router, tokenA, tokenB, tokenAAmount, tokenBAmount]);

  const onSubmitSwapValue = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setTokenAAmount(tokenBAmount);
    setTokenBAmount(tokenAAmount);
  };
  const changeTokenAAmount = useCallback((value: string) => {
    setSwapValue(prev => ({
      ...prev,
      tokenAAmount: value,
      tokenBAmount: "",
    }));
    setTokenAAmount(value);
  }, []);

  const changeTokenBAmount = useCallback((value: string) => {
    setSwapValue(prev => ({
      ...prev,
      tokenBAmount: value,
      tokenAAmount: "",
      type: "EXACT_OUT",
    }));
    setTokenBAmount(value);
  }, []);

  useEffect(() => {
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
      tokenAAmount: "",
      tokenBAmount: "",
    });
  }, []);
  return (
    <HomeSwap
      swapTokenInfo={swapTokenInfo}
      swapNow={swapNow}
      swapValue={swapValue}
      onSubmitSwapValue={onSubmitSwapValue}
      changeTokenAAmount={changeTokenAAmount}
      connected={connected}
      changeTokenBAmount={changeTokenBAmount}
    />
  );
};

export default HomeSwapContainer;
