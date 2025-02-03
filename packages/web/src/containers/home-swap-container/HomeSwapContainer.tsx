import HomeSwap from "@components/home/home-swap/HomeSwap";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import useRouter from "@hooks/common/use-custom-router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { formatPrice } from "@utils/new-number-utils";

const DEFAULT_TOKEN_A_AMOUNT = "1000" as const;

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, displayBalanceMap } = useTokenData();
  const [tokenA] = useState<TokenModel | null>(GNOT_TOKEN);
  const [tokenAAmount] = useState<string>(DEFAULT_TOKEN_A_AMOUNT);
  const [tokenB] = useState<TokenModel | null>(GNS_TOKEN);
  const [tokenBAmount] = useState<string>("");
  const { slippage } = useSlippage();
  const { connected, isSwitchNetwork } = useWallet();
  const [swapValue, setSwapValue] = useAtom(SwapState.swap);

  const tokenABalance = useMemo(() => {
    if (!connected || isSwitchNetwork || !tokenA) return "-";

    // Only the balance in the swap card should be formatted the same with price
    return formatPrice(displayBalanceMap?.[tokenA.priceID], {
      usd: false,
      isKMB: false,
    });
  }, [isSwitchNetwork, connected, displayBalanceMap, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (!connected || isSwitchNetwork || !tokenB) return "-";

    // Only the balance in the swap card should be formatted the same with price
    return formatPrice(displayBalanceMap?.[tokenB.priceID], {
      usd: false,
      isKMB: false,
    });
  }, [isSwitchNetwork, connected, displayBalanceMap, tokenB]);

  const tokenAUSD = useMemo(() => {
    if (!Number(tokenAAmount) || !tokenA || !tokenPrices[checkGnotPath(tokenA.priceID)]) {
      return null;
    }
    const calculateValue = BigNumber(tokenAAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenA.priceID)].usd)
      .toNumber();
    return isNaN(calculateValue) ? null : calculateValue;
  }, [tokenA, tokenAAmount, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!Number(tokenBAmount) || !tokenB || !tokenPrices[checkGnotPath(tokenB.priceID)]) {
      return null;
    }
    const calculateValue = BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenB.priceID)].usd)
      .toNumber();
    return isNaN(calculateValue) ? null : calculateValue;
  }, [tokenB, tokenBAmount, tokenPrices]);

  const swapTokenInfo: SwapTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSD,
      tokenAUSDStr: formatPrice(tokenAUSD, { isKMB: false }),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSD,
      tokenBUSDStr: formatPrice(tokenBUSD, { isKMB: false }),
      direction: "EXACT_IN",
      slippage,
      tokenADecimals: tokenA?.decimals,
      tokenBDecimals: tokenB?.decimals,
    };
  }, [slippage, tokenA, tokenAAmount, tokenABalance, tokenAUSD, tokenB, tokenBAmount, tokenBBalance, tokenBUSD]);

  const swapNow = useCallback(() => {
    const direction = (() => {
      if (tokenAAmount) return "EXACT_IN";

      if (tokenBAmount) return "EXACT_OUT";

      return "EXACT_IN";
    })();

    const queries = [`from=${tokenA?.path}`, `to=${tokenB?.path}`, `direction=${direction}`];
    const queriesString = queries.join("&");
    if (!!tokenAAmount) {
      router.push(`/swap?${queriesString}`);
      setSwapValue(prev => ({
        ...prev,
        tokenAAmount: "",
      }));
    }
  }, [router, tokenA, tokenB, tokenAAmount, tokenBAmount]);

  useEffect(() => {
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
      tokenAAmount: DEFAULT_TOKEN_A_AMOUNT,
      tokenBAmount: "",
    });
  }, []);
  return <HomeSwap swapTokenInfo={swapTokenInfo} swapNow={swapNow} swapValue={swapValue} connected={connected} />;
};

export default HomeSwapContainer;
