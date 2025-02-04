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
import { useInterval } from "@hooks/common/use-interval";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";

const DEFAULT_TOKEN_A_AMOUNT = "1000" as const;
const TOKEN_ROTATION_INTERVAL = 2000 as const;
const TOKEN_TRANSITION_DURATION = 500 as const;

// Interface for animating token conversions
interface TokenTransition {
  isChanging: boolean;
  prevToken: TokenModel | null;
}

const HomeSwapContainer: React.FC = () => {
  const router = useRouter();
  const { tokenPrices, displayBalanceMap, tokens } = useTokenData();
  const [tokenA] = useState<TokenModel | null>(GNOT_TOKEN);
  const [tokenAAmount] = useState<string>(DEFAULT_TOKEN_A_AMOUNT);
  const [tokenB, setTokenB] = useState<TokenModel | null>(GNS_TOKEN);
  // Index of the currently circulating token
  const [currentTokenIndex, setCurrentTokenIndex] = React.useState(0);
  // Manage the transition state of token B (for animation purposes)
  const [tokenBTransition, setTokenBTransition] = useState<TokenTransition>({
    isChanging: true,
    prevToken: null,
  });
  const [tokenBAmount] = useState<string>("");
  const { slippage } = useSlippage();
  const { connected, isSwitchNetwork } = useWallet();
  const [, setSwapValue] = useAtom(SwapState.swap);

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
    if (!Number(DEFAULT_TOKEN_A_AMOUNT) || !tokenA || !tokenPrices[checkGnotPath(tokenA.priceID)]) {
      return null;
    }
    const calculateValue = BigNumber(DEFAULT_TOKEN_A_AMOUNT)
      .multipliedBy(tokenPrices[checkGnotPath(tokenA.priceID)].usd)
      .toNumber();
    return isNaN(calculateValue) ? null : calculateValue;
  }, [tokenA, tokenPrices]);

  const tokenBUSD = useMemo(() => {
    if (!Number(tokenBAmount) || !tokenB || !tokenPrices[checkGnotPath(tokenB.priceID)]) {
      return null;
    }
    const calculateValue = BigNumber(tokenBAmount)
      .multipliedBy(tokenPrices[checkGnotPath(tokenB.priceID)].usd)
      .toNumber();
    return isNaN(calculateValue) ? null : calculateValue;
  }, [tokenB, tokenBAmount, tokenPrices]);

  // Token paths to exclude from circulation (tokenA and Wrapped GNOT)
  const excludedTokenPaths = [tokenA?.path, WRAPPED_GNOT_PATH];

  // Token auto-rotation logic
  useInterval(() => {
    if (tokens && tokens.length > 0) {
      // Generate a list of available tokens by filtering out the ones you want to exclude
      const availableTokens = tokens.filter(token => !excludedTokenPaths.includes(token.path));

      if (availableTokens.length > 0) {
        // Cycle to next token
        const nextIndex = (currentTokenIndex + 1) % availableTokens.length;
        setCurrentTokenIndex(nextIndex);
        setTokenB(availableTokens[nextIndex]);
      }
    }
  }, TOKEN_ROTATION_INTERVAL);

  // Animate the transition whenever token B changes
  useEffect(() => {
    // when the token has actually changed
    if (tokenB && tokenBTransition.prevToken && tokenBTransition.prevToken.path !== tokenB.path) {
      // Set transition to start state
      setTokenBTransition(prev => ({
        isChanging: true,
        prevToken: prev.prevToken,
      }));

      // Change to transition complete after 500ms
      const timer = setTimeout(() => {
        setTokenBTransition({
          isChanging: false,
          prevToken: tokenB,
        });
      }, TOKEN_TRANSITION_DURATION);

      return () => clearTimeout(timer);
      // on initial token setup
    } else if (tokenB && !tokenBTransition.prevToken) {
      setTokenBTransition({
        isChanging: false,
        prevToken: tokenB,
      });
    }
  }, [tokenB]);

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
    }
  }, [router, tokenA, tokenB, tokenAAmount, tokenBAmount]);

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
      connected={connected}
      tokenBTransition={tokenBTransition}
      defaultTokenAAmount={DEFAULT_TOKEN_A_AMOUNT}
    />
  );
};

export default HomeSwapContainer;
