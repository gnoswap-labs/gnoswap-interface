import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import { useTokenData } from "@hooks/token/use-token-data";
import { SwapDirectionType } from "@common/values";
import { useRouter } from "next/router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";

const TokenSwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [openedSlippage, setOpenedSlippage] = useState(false);
  const { tokens, updateTokens } = useTokenData();

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
    slippage,
    setSwapValue,
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
    isLoading,
  } = useSwapHandler();

  useEffect(() => {
    updateTokens();
  }, []);

  useEffect(() => {
    if (!initialized && tokens.length > 0) {
      setInitialized(true);
    }
  }, [tokens]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const query = router.query;
    const currentTokenA = tokens.find(token => token.path === query.tokenA) || null;
    const currentTokenB = tokens.find(token => token.path === query.tokenB) || null;
    const direction: SwapDirectionType = query.direction === "EXACT_OUT" ? "EXACT_OUT" : "EXACT_IN";
    setSwapValue({
      tokenA: currentTokenA,
      tokenB: currentTokenB,
      type: direction,
    });
  }, [initialized]);

  return (
    <>
      <TokenSwap
        connected={connectedWallet}
        connectWallet={openConnectWallet}
        swapNow={openConfirmModal}
        switchSwapDirection={switchSwapDirection}
        copied={copied}
        handleCopied={copyURL}
        themeKey={themeKey}
        handleSetting={() => setOpenedSlippage(true)}
        isSwitchNetwork={isSwitchNetwork}
        dataTokenInfo={swapTokenInfo}
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
      {openedConfirmModal && swapSummaryInfo && (
        <ConfirmSwapModal
          submitted={submitted}
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfo}
          swapResult={swapResult}
          swap={executeSwap}
          close={closeModal}
        />
      )}
      {openedSlippage && (
        <SettingMenuModal
          slippage={slippage}
          changeSlippage={changeSlippage}
          close={() => setOpenedSlippage(false)}
          className="swap-setting-class"
        />
      )}
    </>
  );
};

export default TokenSwapContainer;
