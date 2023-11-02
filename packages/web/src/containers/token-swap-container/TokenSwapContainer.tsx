import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import { ThemeState, TokenState } from "@states/index";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useSwap } from "@hooks/swap/use-swap";
import { useTokenData } from "@hooks/token/use-token-data";
import BigNumber from "bignumber.js";
import { SwapError } from "@common/errors/swap";
import { TokenModel } from "@models/token/token-model";
import { DataTokenInfo } from "@models/token/token-swap-model";
import { matchInputNumber, numberToUSD } from "@utils/number-utils";
import { AmountModel } from "@models/common/amount-model";
import { amountEmptyNumberInit } from "@common/values";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { swapRouteInfos as tempSwapRouteInfos } from "@components/swap/swap-card/SwapCard.stories";

const swapSummaryInfoTemp: SwapSummaryInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "GNOT",
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT",
  },
  gasFeeUSD: 0.1,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenAAmount: "0",
  tokenABalance: "0",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenBAmount: "0",
  tokenBBalance: "0",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: 10,
};

const TokenSwapContainer: React.FC = () => {
  const [swapValue, setSwapValue] = useAtom(TokenState.swap);
  const { tokenA = null, tokenB = null, type = "EXACT_IN" } = swapValue;

  const [copied, setCopied] = useState(false);
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false);
  const [openedSetting, setOpenedSetting] = useState(false);
  const [tokenAAmount, setTokenAAmount] = useState<string>("");
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapError, setSwapError] = useState<SwapError | null>(null);
  const [swapRate] = useState<number>(100);
  const [gasFeeAmount] = useState<AmountModel>(amountEmptyNumberInit);
  const [swapRouteInfos] = useState<SwapRouteInfo[]>(tempSwapRouteInfos);
  const [slippage, setSlippage] = useState(1);

  const {
    tokenPrices,
    balances,
    updateTokens,
    updateTokenPrices,
  } = useTokenData();
  const {
    connected: connectedWallet,
    isSwitchNetwork,
    switchNetwork,
    connectAdenaClient,
  } = useWallet();
  const { getExpectedSwap } = useSwap({
    tokenA,
    tokenB,
    direction: type,
    slippage: 1,
  });

  const themeKey = useAtomValue(ThemeState.themeKey);
  const swapNow = useCallback(() => {
    setOpenedConfirmModal(true);
  }, []);

  const connectWallet = useCallback(() => {
    if (!connectedWallet) {
      connectAdenaClient();
    } else if (isSwitchNetwork) {
      switchNetwork();
    }
  }, [switchNetwork, connectAdenaClient, isSwitchNetwork, connectedWallet]);

  const switchSwapDirection = useCallback(() => {
    const preTokenA = tokenA ? { ...tokenA } : null;
    const preTokenB = tokenB ? { ...tokenB } : null;
    const changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";

    if (!!Number(tokenAAmount || 0) && !!Number(tokenBAmount || 0)) {
      setIsLoading(true);
    }
    setSwapValue(() => ({
      tokenA: preTokenB,
      tokenB: preTokenA,
      type: changedSwapDirection,
    }));
    if (changedSwapDirection === "EXACT_IN") {
      setTokenAAmount(tokenBAmount);
      if (!preTokenA || !preTokenB) {
        setTokenBAmount(tokenAAmount);
      }
    } else {
      setTokenBAmount(tokenAAmount);
      if (!preTokenA || !preTokenB) {
        setTokenAAmount(tokenBAmount);
      }
    }
  }, [type, tokenA, tokenAAmount, tokenB, tokenBAmount]);

  const handleCopied = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  const handleCloseSetting = () => {
    setOpenedSetting(false);
  };

  const handleSetting = () => {
    setOpenedSetting(true);
  };

  const checkBalance = useCallback(
    (token: TokenModel, amount: string) => {
      const tokenBalance = balances[token.priceId] || 0;
      return BigNumber(tokenBalance).isGreaterThan(amount);
    },
    [balances]
  );

  const tokenABalance = useMemo(() => {
    if (tokenA && !Number.isNaN(balances[tokenA.priceId])) {
      return BigNumber(balances[tokenA.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (tokenB && !Number.isNaN(balances[tokenB.priceId])) {
      return BigNumber(balances[tokenB.priceId] || 0).toFormat();
    }
    return "-";
  }, [balances, tokenB]);

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

  useEffect(() => {
    if (!tokenA || !tokenB) {
      return;
    }
    const isExactIn = type === "EXACT_IN";
    const changedAmount = isExactIn ? tokenAAmount : tokenBAmount;
    if (
      Number.isNaN(changedAmount) ||
      BigNumber(changedAmount).isLessThanOrEqualTo(0)
    ) {
      return;
    }
    const timeout = setTimeout(() => {
      getExpectedSwap(changedAmount).then((result) => {
        const isError = result === null;
        const expectedAmount = isError ? "" : result;
        let swapError = null;
        if (isError) {
          swapError = new SwapError("INSUFFICIENT_BALANCE");
        }
        if (
          !checkBalance(tokenA, tokenAAmount) ||
          !checkBalance(tokenB, tokenBAmount)
        ) {
          swapError = new SwapError("INSUFFICIENT_BALANCE");
        }

        if (isExactIn) {
          setTokenBAmount(expectedAmount);
        } else {
          setTokenAAmount(expectedAmount);
        }
        setSwapError(swapError);
        setIsLoading(() => false);
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [
    checkBalance,
    getExpectedSwap,
    type,
    tokenA,
    tokenAAmount,
    tokenB,
    tokenBAmount,
    isLoading,
  ]);

  const dataTokenInfo: DataTokenInfo = useMemo(() => {
    return {
      tokenA,
      tokenAAmount,
      tokenABalance,
      tokenAUSDStr: numberToUSD(tokenAUSD),
      tokenB,
      tokenBAmount,
      tokenBBalance,
      tokenBUSDStr: numberToUSD(tokenBUSD),
      direction: type,
    };
  }, [
    type,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenB,
    tokenABalance,
    tokenBBalance,
    tokenAUSD,
    tokenBUSD,
  ]);

  const changeTokenA = useCallback(
    (token: TokenModel) => {
      let changedSwapDirection = type;
      if (tokenB?.symbol === token.symbol) {
        changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
        setTokenAAmount(tokenBAmount);
        setTokenBAmount(tokenAAmount);
      }
      setSwapValue((prev) => ({
        tokenA: prev.tokenB?.symbol === token.symbol ? prev.tokenB : token,
        tokenB:
          prev.tokenB?.symbol === token.symbol ? prev.tokenA : prev.tokenB,
        type: changedSwapDirection,
      }));
    },
    [tokenA, tokenB, type, tokenBAmount, tokenAAmount]
  );

  const changeTokenB = useCallback(
    (token: TokenModel) => {
      let changedSwapDirection = type;
      if (tokenA?.symbol === token.symbol) {
        changedSwapDirection = type === "EXACT_IN" ? "EXACT_OUT" : "EXACT_IN";
        setTokenAAmount(tokenBAmount);
        setTokenBAmount(tokenAAmount);
      }
      setSwapValue((prev) => ({
        tokenB: prev.tokenA?.symbol === token.symbol ? prev.tokenA : token,
        tokenA:
          prev.tokenA?.symbol === token.symbol ? prev.tokenB : prev.tokenA,
        type: changedSwapDirection,
      }));
    },
    [tokenA, type, tokenBAmount, tokenAAmount]
  );

  const changeTokenAAmount = useCallback(
    (value: string) => {
      if (!matchInputNumber(value)) {
        return;
      }
      if (!!Number(value)) {
        setIsLoading(true);
      } else {
        setTokenBAmount("0");
      }
      setSwapValue((prev) => ({
        ...prev,
        type: "EXACT_IN",
      }));
      setTokenAAmount(value);
    },
    [setTokenBAmount]
  );

  const changeTokenBAmount = useCallback(
    (value: string) => {
      if (!matchInputNumber(value)) {
        return;
      }
      if (!!Number(value)) {
        setIsLoading(true);
      } else {
        setTokenAAmount("0");
      }
      setSwapValue((prev) => ({
        ...prev,
        type: "EXACT_OUT",
      }));
      setTokenBAmount(value);
    },
    [setTokenAAmount]
  );

  useEffect(() => {
    updateTokens();
    updateTokenPrices();
  }, []);

  const swapButtonText = useMemo(() => {
    if (!connectedWallet) {
      return "Connect Wallet";
    }
    if (isSwitchNetwork) {
      return "Switch to Gnoland";
    }
    if (!tokenA || !tokenB) {
      return "Select a Token";
    }
    if (!Number(tokenAAmount) && !Number(tokenAAmount)) {
      return "Enter Amount";
    }
    if (
      (Number(tokenAAmount) < 0.000001 && type === "EXACT_IN") ||
      (Number(tokenBAmount) < 0.000001 && type === "EXACT_OUT")
    ) {
      return "Amount Too Low";
    }

    if (type === "EXACT_IN") {
      if (
        Number(tokenAAmount) >
        Number(parseFloat(tokenABalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    } else {
      if (
        Number(tokenBAmount) >
        Number(parseFloat(tokenBBalance.replace(/,/g, "")))
      ) {
        return "Insufficient Balance";
      }
    }
    return "Swap";
  }, [
    connectedWallet,
    swapError,
    tokenA,
    tokenB,
    isSwitchNetwork,
    tokenAAmount,
    tokenBAmount,
    type,
    tokenBBalance,
    tokenABalance,
  ]);

  const isAvailSwap = useMemo(() => {
    if (isLoading) return false;
    if (!connectedWallet) {
      return true;
    }
    if (isSwitchNetwork) {
      return false;
    }
    if (!tokenA || !tokenB) {
      return false;
    }
    if (!tokenAAmount && !tokenAAmount) {
      return false;
    }
    if (
      (Number(tokenAAmount) !== 0 && Number(tokenAAmount) < 0.000001) ||
      Number(tokenBAmount) < 0.000001
    ) {
      return false;
    }
    if (type === "EXACT_IN") {
      if (
        Number(tokenAAmount) >
        Number(parseFloat(tokenABalance.replace(/,/g, "")))
      ) {
        return false;
      }
    } else {
      if (
        Number(tokenBAmount) >
        Number(parseFloat(tokenBBalance.replace(/,/g, "")))
      ) {
        return false;
      }
    }
    return true;
  }, [
    connectedWallet,
    swapError,
    tokenA,
    tokenB,
    isSwitchNetwork,
    tokenAAmount,
    tokenBAmount,
    type,
    tokenBBalance,
    tokenABalance,
    isLoading,
  ]);

  const swapSummaryInfo: SwapSummaryInfo | null = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }
    const swapRateUSD = BigNumber(swapRate).multipliedBy(1).toNumber();
    const gasFeeUSD = BigNumber(gasFeeAmount.amount).multipliedBy(1).toNumber();
    return {
      tokenA,
      tokenB,
      swapDirection: type,
      swapRate,
      swapRateUSD,
      priceImpact: 0.1,
      guaranteedAmount: {
        amount: BigNumber(tokenBAmount).toNumber(),
        currency: type === "EXACT_IN" ? tokenB.symbol : tokenA.symbol,
      },
      gasFee: gasFeeAmount,
      gasFeeUSD,
    };
  }, [gasFeeAmount, type, swapRate, tokenA, tokenB, tokenBAmount]);

  const changeSlippage = useCallback((value: string) => {
    setSlippage(BigNumber(value || 0).toNumber());
  }, [setSlippage]);

  return (
    <>
      <TokenSwap
        connected={connectedWallet}
        connectWallet={connectWallet}
        swapNow={swapNow}
        switchSwapDirection={switchSwapDirection}
        copied={copied}
        handleCopied={handleCopied}
        themeKey={themeKey}
        handleSetting={handleSetting}
        isSwitchNetwork={isSwitchNetwork}
        dataTokenInfo={dataTokenInfo}
        changeTokenA={changeTokenA}
        changeTokenB={changeTokenB}
        changeTokenAAmount={changeTokenAAmount}
        changeTokenBAmount={changeTokenBAmount}
        isLoading={isLoading}
        isAvailSwap={isAvailSwap}
        swapButtonText={swapButtonText}
        swapSummaryInfo={swapSummaryInfo}
        swapRouteInfos={swapRouteInfos}
      />
      {openedConfirmModal && (
        <ConfirmSwapModal
          submitted={false}
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfoTemp}
          swapResult={null}
          swap={swapNow}
          close={() => setOpenedConfirmModal(false)}
        />
      )}
      {openedSetting && (
        <SettingMenuModal
          slippage={slippage}
          changeSlippage={changeSlippage}
          close={handleCloseSetting}
          className="swap-setting-class"
        />
      )}
    </>
  );
};

export default TokenSwapContainer;
