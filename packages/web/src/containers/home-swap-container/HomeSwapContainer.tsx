import { SwapDirectionType } from "@common/values";
import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import { numberToUSD } from "@utils/number-utils";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
const GNOS_PATH = "gno.land/r/demo/gns" || "";

const TOKEN_A: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  type: "native",
  priceId: "gnot",
};
const TOKEN_B: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: GNOS_PATH,
  decimals: 4,
  symbol: "GNS",
  logoURI: "/gnos.svg",
  type: "grc20",
  priceId: GNOS_PATH,
};

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, displayBalanceMap } = useTokenData();
  const [tokenA, setTokenA] = useState<TokenModel | null>(TOKEN_A);
  const [tokenAAmount, setTokenAAmount] = useState<string>("1000");
  const [tokenB, setTokenB] = useState<TokenModel | null>(TOKEN_B);
  const [tokenBAmount, setTokenBAmount] = useState<string>("0");
  const [swapDirection, setSwapDirection] =
    useState<SwapDirectionType>("EXACT_IN");
  const { slippage } = useSlippage();
  const { connected } = useWallet();
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);

  const tokenABalance = useMemo(() => {
    if (!connected) return "-";
    if (tokenA && displayBalanceMap[tokenA.priceId]) {
      const balance = displayBalanceMap[tokenA.priceId] || 0;
      return BigNumber(balance).toFormat(tokenA.decimals);
    }
    return "0";
  }, [connected, displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (!connected) return "-";
    if (tokenB && displayBalanceMap[tokenB.priceId]) {
      const balance = displayBalanceMap[tokenB.priceId] || 0;
      return BigNumber(balance).toFormat(tokenB.decimals);
    }
    return "0";
  }, [connected, displayBalanceMap, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[tokenA.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[tokenA.priceId].usd)
      .toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!Number(tokenBAmount) || !tokenB || !tokenPrices[tokenB.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[tokenB.priceId].usd)
      .toNumber();
  }, [tokenB, tokenBAmount, tokenPrices]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: numberToUSD(tokenAUSD),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: numberToUSD(tokenBUSD),
      direction: swapDirection,
      slippage,
    };
  }, [
    slippage,
    swapDirection,
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
    if (swapDirection === "EXACT_IN") {
      router.push(
        `/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}&direction=EXACT_IN`,
      );
    } else {
      router.push(
        `/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}&direction=EXACT_IN`,
      );
    }
  }, [router, swapDirection, tokenA, tokenB]);

  const onSubmitSwapValue = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setSwapDirection(prev => (prev === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN"));
  };

  const changeTokenAAmount = useCallback((value: string) => {
    setSwapValue(prev => ({
      ...prev,
      tokenAAmount: value,
    }));
    setTokenAAmount(value);
  }, []);

  const changeTokenBAmount = useCallback((value: string) => {
    setSwapValue(prev => ({
      ...prev,
      tokenBAmount: value,
    }));
    setTokenBAmount(value);
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
