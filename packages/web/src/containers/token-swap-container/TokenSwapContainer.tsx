import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";

import SettingMenuModal from "@components/common/setting-menu-modal/SettingMenuModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { useGetToken } from "@query/token";
import { ThemeState } from "@states/index";

const TokenSwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useCustomRouter();
  const [openedSlippage, setOpenedSlippage] = useState(false);
  const { getGnotPath } = useGnotToGnot();
  const path = router.getTokenPath();
  const tokenAPath = router.getParameter("tokenA");
  const { data: tokenB } = useGetToken(path, {
    enabled: !!path,
  });
  const { data: tokenA = null } = useGetToken(tokenAPath, {
    enabled: !!tokenAPath,
  });

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
    isLoading,
    swapValue,
    setSwapRateAction,
    setTokenAAmount,
    priceImpactStatus,
  } = useSwapHandler();

  useEffect(() => {
    setSwapValue({
      tokenA: null,
      tokenB: null,
      type: "EXACT_IN",
    });
    setTokenAAmount("");
  }, []);

  useEffect(() => {
    let request = {};
    if (tokenA && tokenB && tokenA.symbol !== tokenB?.symbol) {
      request = {
        tokenB: {
          ...tokenB,
          path: getGnotPath(tokenB).path,
          symbol: getGnotPath(tokenB).symbol,
          logoURI: getGnotPath(tokenB).logoURI,
          name: getGnotPath(tokenB).name,
        },
        tokenA: {
          ...tokenA,
          path: getGnotPath(tokenA).path,
          symbol: getGnotPath(tokenA).symbol,
          logoURI: getGnotPath(tokenA).logoURI,
          name: getGnotPath(tokenA).name,
        },
      };
    } else if (tokenA) {
      request = {
        tokenA: {
          ...tokenA,
          path: getGnotPath(tokenA).path,
          symbol: getGnotPath(tokenA).symbol,
          logoURI: getGnotPath(tokenA).logoURI,
          name: getGnotPath(tokenA).name,
        },
      };
    } else {
      if (swapValue?.tokenA?.symbol === tokenB?.symbol) request = {};
      else {
        request = {
          tokenB: {
            ...tokenB,
            path: getGnotPath(tokenB).path,
            symbol: getGnotPath(tokenB).symbol,
            logoURI: getGnotPath(tokenB).logoURI,
            name: getGnotPath(tokenB).name,
          },
        };
      }
    }
    setSwapValue(prev => {
      return {
        ...prev,
        ...request,
      };
    });
  }, [tokenB, tokenA, swapValue?.tokenA?.symbol]);

  const handleChangeTokenB = (token: TokenModel) => {
    if (token.path === swapTokenInfo.tokenB?.path) return;

    router.movePageWithTokenPath("TOKEN", token.path);
    changeTokenB(token);
  };

  const handleChangeTokenA = (token: TokenModel) => {
    changeTokenA(token);
  };

  const handleSwitch = () => {
    if (swapValue?.tokenA?.path && swapValue?.tokenA?.path !== path) {
      router.movePageWithTokenPath("TOKEN", swapValue?.tokenA?.path);
    }
    switchSwapDirection();
  };

  return (
    <>
      <TokenSwap
        connected={connectedWallet}
        connectWallet={openConnectWallet}
        swapNow={openConfirmModal}
        switchSwapDirection={handleSwitch}
        copied={copied}
        handleCopied={copyURL}
        themeKey={themeKey}
        handleSetting={() => setOpenedSlippage(true)}
        isSwitchNetwork={isSwitchNetwork}
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
