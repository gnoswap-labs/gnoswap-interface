import React, { useEffect } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";
import { TokenModel } from "@models/token/token-model";
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
const SwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  const {
    connectedWallet,
    copied,
    swapTokenInfo,
    swapSummaryInfo,
    swapRouteInfos,
    isAvailSwap,
    swapButtonText,
    submitted,
    swapResult,
    openedConfirmModal,
    changeTokenA,
    changeTokenAAmount,
    changeTokenB,
    changeTokenBAmount,
    changeSlippage,
    switchSwapDirection,
    openConfirmModal,
    openConnectWallet,
    closeModal,
    copyURL,
    executeSwap,
    isSwitchNetwork,
    switchNetwork,
    isLoading,
    setSwapValue,
    setSwapRateAction,
  } = useSwapHandler();

  useEffect(() => {
    setSwapValue({
      tokenA: TOKEN_A,
      tokenB: null,
      type: "EXACT_IN",
    });
  }, []);

  return (
    <SwapCard
      connectedWallet={connectedWallet}
      copied={copied}
      swapTokenInfo={swapTokenInfo}
      swapSummaryInfo={swapSummaryInfo}
      swapRouteInfos={swapRouteInfos}
      isAvailSwap={isAvailSwap}
      swapButtonText={swapButtonText}
      submitted={submitted}
      swapResult={swapResult}
      openedConfirmModal={openedConfirmModal}
      changeTokenA={changeTokenA}
      changeTokenAAmount={changeTokenAAmount}
      changeTokenB={changeTokenB}
      changeTokenBAmount={changeTokenBAmount}
      changeSlippage={changeSlippage}
      switchSwapDirection={switchSwapDirection}
      openConfirmModal={openConfirmModal}
      openConnectWallet={openConnectWallet}
      closeModal={closeModal}
      copyURL={copyURL}
      swap={executeSwap}
      themeKey={themeKey}
      isSwitchNetwork={isSwitchNetwork}
      switchNetwork={switchNetwork}
      isLoading={isLoading}
      setSwapRateAction={setSwapRateAction}
    />
  );
};

export default SwapContainer;
