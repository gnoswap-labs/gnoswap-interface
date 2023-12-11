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

const TOKEN_A = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "Gnoland",
  decimals: 4,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gno.land/r/Gnoland",
};
const TOKEN_B = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI: "/gnos.svg",
  priceId: "gno.land/r/gns",
};

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, balances } = useTokenData();
  const [tokenA, setTokenA] = useState<TokenModel | null>(TOKEN_A);
  const [tokenAAmount] = useState<string>("1000");
  const [tokenB, setTokenB] = useState<TokenModel | null>(TOKEN_B);
  const [tokenBAmount] = useState<string>("0");
  const [swapDirection, setSwapDirection] = useState<SwapDirectionType>("EXACT_IN");
  const { slippage } = useSlippage();
  const { connected, account } = useWallet();
  const [, setSwapValue] = useAtom(SwapState.swap);
  
  const tokenABalance = useMemo(() => {
    if (!connected) return "-";
    if (account?.balances[0].amount) {
      return `${(Number(account?.balances[0].amount) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return "0";
  }, [connected, account]);

  const tokenBBalance = useMemo(() => {
    if (!connected) return "-";
    if (tokenB && balances[tokenB.priceId]) {
      return BigNumber(balances[tokenB.priceId] || 0).toFormat();
    }
    return "0";
  }, [connected ,balances, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[tokenA.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[tokenA.priceId].usd)
      .toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!tokenB || !tokenPrices[tokenB.priceId]) {
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
      router.push(`/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}&direction=EXACT_IN`);
    } else {
      router.push(`/swap?tokenA=${tokenA?.path}&tokenB=${tokenB?.path}&direction=EXACT_IN`);
    }
  }, [router, swapDirection, tokenA, tokenB]);

  const onSubmitSwapValue = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setSwapDirection(prev => prev === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN");
  };

  const changeTokenAAmount = useCallback((value: string) => {
    setSwapValue((prev) => ({
      ...prev,
      tokenAAmount: value,
    }));
  }, []);


  return (
    <HomeSwap
      swapTokenInfo={swapTokenInfo}
      swapNow={swapNow}
      onSubmitSwapValue={onSubmitSwapValue}
      changeTokenAAmount={changeTokenAAmount}
    />
  );
};

export default HomeSwapContainer;
