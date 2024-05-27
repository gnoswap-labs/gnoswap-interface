import { SwapDirectionType } from "@common/values";
import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { formatUsdNumber } from "@utils/stake-position-utils";
import { isEmptyObject } from "@utils/validation-utils";
import { checkGnotPath } from "@utils/common";
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
  priceID: "gnot",
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
  priceID: GNOS_PATH,
};

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, displayBalanceMap } = useTokenData();
  const [tokenA, setTokenA] = useState<TokenModel | null>(TOKEN_A);
  const [tokenAAmount, setTokenAAmount] = useState<string>("");
  const [tokenB, setTokenB] = useState<TokenModel | null>(TOKEN_B);
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [swapDirection, setSwapDirection] =
    useState<SwapDirectionType>("EXACT_IN");
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
    if (!Number(tokenBAmount) || !tokenB || !tokenPrices[checkGnotPath(tokenB.priceID)]) {
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
      direction: swapDirection,
      slippage,
      tokenADecimals: tokenA?.decimals,
      tokenBDecimals: tokenB?.decimals,
    };
  }, [slippage, swapDirection, tokenA, tokenAAmount, tokenABalance, tokenAUSD, tokenB, tokenBAmount, tokenBBalance, tokenBUSD]);

  const swapNow = useCallback(() => {
    const queries = [
      `from=${tokenA?.path}`,
      `to=${tokenB?.path}`,
      `direction=${swapDirection}`,
      ...tokenAAmount ? [`token_a_amount=${tokenAAmount}`] : [],
      ...tokenBAmount ? [`token_b_amount=${tokenBAmount}`] : [],
    ];
    const queriesString = queries.join("&");
    console.log("🚀 ~ swapNow ~ queries:", queriesString);

    console.log("🚀 ~ swapNow ~ tokenBAmount:", tokenBAmount);
    console.log("🚀 ~ swapNow ~ tokenAAmount:", tokenAAmount);
    console.log("🚀 ~ swapNow ~ swapDirection:", swapDirection);
    if (!!swapDirection && (!!tokenAAmount || !!tokenBAmount)) {
      router.push(
        `/swap?${queriesString}`
      );
    }
  }, [router, swapDirection, tokenA, tokenB, tokenAAmount, tokenBAmount]);

  const onSubmitSwapValue = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setSwapDirection(prev => (prev === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN"));
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
    console.log("🚀 ~ changeTokenBAmount ~ value:", value);
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
