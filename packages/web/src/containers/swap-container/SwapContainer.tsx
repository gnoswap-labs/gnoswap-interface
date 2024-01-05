import React, { useEffect, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapDirectionType } from "@common/values";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import { useRouter } from "next/router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";

import { TokenModel } from "@models/token/token-model";
const TOKEN_A: TokenModel = {
  type: "native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  wrappedPath: "gno.land/r/demo/wugnot",
};
const SwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { tokens } = useTokenData();

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
    if (!initialized && tokens.length > 0) {
      setInitialized(true);
    }
  }, [tokens]);

  useEffect(() => {
    setSwapValue({
      tokenA: TOKEN_A,
      tokenB: null,
      type: "EXACT_IN",
    });
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const query = router.query;
    const currentTokenA =
      tokens.find(token => token.path === query.tokenA) || null;
    const currentTokenB =
      tokens.find(token => token.path === query.tokenB) || null;
    const direction: SwapDirectionType =
      query.direction === "EXACT_OUT" ? "EXACT_OUT" : "EXACT_IN";
    if (!currentTokenA || !currentTokenB) return;

    setSwapValue({
      tokenA: currentTokenA,
      tokenB: currentTokenB,
      type: direction,
    });
  }, [initialized]);

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
