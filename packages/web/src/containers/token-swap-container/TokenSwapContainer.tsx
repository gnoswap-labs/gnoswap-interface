import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import { useRouter } from "next/router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";
import { useGetTokenByPath } from "@query/token";
import { TokenModel } from "@models/token/token-model";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

const TokenSwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [openedSlippage, setOpenedSlippage] = useState(false);
  const { getGnotPath } = useGnotToGnot();
  const path = router.query["tokenB"] as string;
  const { data: tokenB = null, isFetched } = useGetTokenByPath(path, { enabled: !!path});
  const { isLoadingCommon } = useLoading();
  
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
    swapValue,
    setSwapRateAction,
  } = useSwapHandler();

  useEffect(() => {
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });
  }, []);

  useEffect(() => {
    if (isFetched && tokenB) {
      setSwapValue(prev => {
        return {
          ...prev,
          tokenB: {
            ...tokenB,
            path: getGnotPath(tokenB).path,
            symbol: getGnotPath(tokenB).symbol,
            logoURI: getGnotPath(tokenB).logoURI,
            name: getGnotPath(tokenB).name,
          },
        };
      });
    }
  }, [tokenB, isFetched]);
  
  const handleChangeTokenB = (token: TokenModel) => {
    const tokenBTemp = swapValue.tokenA?.symbol === token.symbol ? swapValue.tokenA : token;
    router.push(`/tokens/${tokenBTemp.symbol}?tokenB=${tokenBTemp.path}&direction=EXACT_IN`);
    changeTokenB(token);
  };
  
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
        changeTokenB={handleChangeTokenB}
        changeTokenAAmount={changeTokenAAmount}
        changeTokenBAmount={changeTokenBAmount}
        isLoading={isLoading || isLoadingCommon}
        isAvailSwap={isAvailSwap}
        swapButtonText={swapButtonText}
        swapSummaryInfo={swapSummaryInfo}
        swapRouteInfos={swapRouteInfos}
        setSwapRateAction={setSwapRateAction}
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
