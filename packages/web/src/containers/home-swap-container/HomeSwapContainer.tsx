import { SwapDirectionType } from "@common/values";
import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import { numberToUSD } from "@utils/number-utils";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

const FooToken = {
  "chainId": "dev",
  "createdAt": "2023-10-17T05:58:00+09:00",
  "name": "Foo",
  "address": "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
  "path": "gno.land/r/foo",
  "decimals": 4,
  "symbol": "FOO",
  "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  "priceId": "gno.land/r/foo"
};

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, balances } = useTokenData();
  const [tokenA] = useState<TokenModel | null>(FooToken);
  const [tokenAAmount] = useState<string>("1000");
  const [tokenB] = useState<TokenModel | null>(null);
  const [tokenBAmount] = useState<string>("0");
  const [swapDirection] = useState<SwapDirectionType>("EXACT_IN");
  const { slippage } = useSlippage();

  const tokenABalance = useMemo(() => {
    if (tokenA && balances[tokenA.priceId]) {
      return BigNumber(balances[tokenA.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && balances[tokenB.priceId]) {
      return BigNumber(balances[tokenB.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!tokenA || !tokenPrices[tokenA.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenAAmount).multipliedBy(tokenPrices[tokenA.priceId].usd).toNumber();
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!tokenB || !tokenPrices[tokenB.priceId]) {
      return Number.NaN;
    }
    return BigNumber(tokenBAmount).multipliedBy(tokenPrices[tokenB.priceId].usd).toNumber();
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
      slippage
    };
  }, [slippage, swapDirection, tokenA, tokenAAmount, tokenABalance, tokenAUSD, tokenB, tokenBAmount, tokenBBalance, tokenBUSD]);

  const swapNow = useCallback(() => {
    router.push("/swap?from=GNOT&to=GNOS");
  }, [router]);

  return (
    <HomeSwap
      swapTokenInfo={swapTokenInfo}
      swapNow={swapNow}
    />
  );
};

export default HomeSwapContainer;
