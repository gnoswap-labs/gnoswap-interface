import { useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react";

import SettingMenuModal from "@components/common/setting-menu-modal/SettingMenuModal";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/data/use-swap-handler";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useGetToken } from "@query/token";
import { ThemeState } from "@states/index";
import {
  getSwapExtensionByOriginPath,
  getSwapExtensionByWrappedPath,
  isSwapExtensionPair,
} from "@resources/swap-extension";

import TokenSwap from "../../components/token-swap/TokenSwap";


const TokenSwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useCustomRouter();
  const [openedSlippage, setOpenedSlippage] = useState(false);
  const path = router.getTokenPath();
  const tokenAPath = router.getParameter("tokenA");
  const { data: tokenB } = useGetToken(path, {
    enabled: !!path,
  });
  const { data: tokenA = null } = useGetToken(tokenAPath, {
    enabled: !!tokenAPath,
  });
  const { swapExtensionTokens } = useTokenData(true);

  const {
    connectedWallet,
    copied,
    swapTokenInfo,
    swapSummaryInfo,
    swapRouteInfos,
    isAvailSwap,
    swapButtonText,
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
    copyURL,
    isSwitchNetwork,
    switchNetwork,
    isLoading,
    isRefetching,
    swapValue,
    setSwapRateAction,
    setTokenAAmount,
    priceImpactStatus,
    initializeSwapTokenInputAmount,
    isSameToken,
  } = useSwapHandler();
  const additionalTokenATokens = useMemo(() => {
    const extension = getSwapExtensionByWrappedPath(swapValue?.tokenB?.path);
    if (!extension) return [];
    const originToken = swapExtensionTokens.find(token => token.path === extension.originTokenPath);
    return originToken ? [originToken] : [];
  }, [swapExtensionTokens, swapValue?.tokenB?.path]);
  const additionalTokenBTokens = useMemo(() => {
    const extension = getSwapExtensionByWrappedPath(swapValue?.tokenA?.path);
    if (!extension) return [];
    const originToken = swapExtensionTokens.find(token => token.path === extension.originTokenPath);
    return originToken ? [originToken] : [];
  }, [swapExtensionTokens, swapValue?.tokenA?.path]);

  useEffect(() => {
    if (!router.query.tokenA && !router.query.path) {
      setSwapValue({
        tokenA: null,
        tokenB: null,
        type: "EXACT_IN",
      });
      setTokenAAmount("");
    }
  }, []);

  useEffect(() => {
    if (!tokenA && !tokenB) return;

    const extension = getSwapExtensionByWrappedPath(tokenB?.path);
    const originToken = extension
      ? swapExtensionTokens.find(token => token.path === extension.originTokenPath) ?? null
      : null;
    if (extension && !originToken) return;
    if (extension && originToken && tokenA?.path === extension.grc20WrappedTokenPath) {
      setSwapValue(prev => ({
        ...prev,
        tokenA,
        tokenB: originToken,
        type: "EXACT_IN",
      }));
      return;
    }
    if (!tokenA && tokenB && originToken) {
      setSwapValue(prev => ({
        ...prev,
        tokenA: originToken,
        tokenB,
        type: "EXACT_IN",
      }));
      return;
    }

    let request = {};
    if (tokenA && tokenB && tokenA.path !== tokenB.path) {
      request = { tokenA, tokenB };
    } else if (tokenA) {
      request = { tokenA };
    } else {
      request = { tokenB };
    }
    setSwapValue(prev => ({
      ...prev,
      ...request,
    }));
  }, [setSwapValue, swapExtensionTokens, tokenA, tokenB]);

  // Initialize token information when component mounts/unmounts
  useEffect(() => {
    initializeSwapTokenInputAmount();

    return () => initializeSwapTokenInputAmount();
  }, []);

  const handleChangeTokenB = (token: TokenModel) => {
    if (token.path === swapTokenInfo.tokenB?.path) return;

    const extension = getSwapExtensionByOriginPath(token.path);
    const tokenPath = extension?.grc20WrappedTokenPath ?? token.path;
    const nextTokenAPath = swapTokenInfo.tokenA?.path;
    changeTokenB(token);
    router.movePage("TOKEN", {
      path: tokenPath,
      tokenA: nextTokenAPath,
    });
  };

  const handleChangeTokenA = (token: TokenModel) => {
    changeTokenA(token);
  };

  const handleSwitch = () => {
    if (
      !isSwapExtensionPair(swapValue?.tokenA, swapValue?.tokenB) &&
      swapValue?.tokenA?.path &&
      swapValue.tokenA.path !== path
    ) {
      router.movePageWithTokenPath("TOKEN", swapValue.tokenA.path);
    }
    switchSwapDirection();
  };

  return (
    <>
      <TokenSwap
        additionalTokenATokens={additionalTokenATokens}
        additionalTokenBTokens={additionalTokenBTokens}
        connectedWallet={connectedWallet}
        connectWallet={openConnectWallet}
        swapNow={openConfirmModal}
        switchSwapDirection={handleSwitch}
        copied={copied}
        handleCopied={copyURL}
        themeKey={themeKey}
        handleSetting={() => setOpenedSlippage(true)}
        isSwitchNetwork={isSwitchNetwork}
        switchNetwork={switchNetwork}
        dataTokenInfo={swapTokenInfo}
        changeTokenA={handleChangeTokenA}
        changeTokenB={handleChangeTokenB}
        changeTokenAAmount={changeTokenAAmount}
        changeTokenBAmount={changeTokenBAmount}
        isLoading={isLoading}
        isAvailSwap={isAvailSwap}
        swapButtonText={swapButtonText}
        swapSummaryInfo={swapSummaryInfo}
        swapRouteInfos={swapRouteInfos}
        setSwapRateAction={setSwapRateAction}
        priceImpactStatus={priceImpactStatus}
        swapTokenInfo={swapTokenInfo}
        isRefetching={isRefetching}
        isSameToken={isSameToken}
      />
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
