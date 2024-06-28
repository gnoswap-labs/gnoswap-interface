// import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import useRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/use-swap-handler";
import { useGetTokenByPath } from "@query/token";
import { TokenModel } from "@models/token/token-model";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { encryptId, makeId } from "@utils/common";

const TokenSwapContainer: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const [openedSlippage, setOpenedSlippage] = useState(false);
  const { getGnotPath } = useGnotToGnot();
  const path = router.query["token-path"] as string;
  const tokenAPath = router.query["tokenA"] as string;
  // Prefetched by server side
  const { data: tokenB } = useGetTokenByPath(path, {
    enabled: !!path,
  });
  const { data: tokenA = null } = useGetTokenByPath(tokenAPath, {
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
    // submitted,
    // swapResult,
    // openedConfirmModal,
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
    // closeModal,
    copyURL,
    // executeSwap,
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
    if (
      swapValue?.tokenB?.path ===
        encryptId(router?.query?.["token-path"] as string) &&
      swapValue?.tokenA?.symbol !== token?.symbol
    ) {
      router.push(`/tokens/${makeId(token.path)}`);
    }
    changeTokenB(token);
  };

  const handleChangeTokenA = (token: TokenModel) => {
    if (
      swapValue?.tokenA?.path ===
        encryptId(router?.query?.["token-path"] as string) &&
      swapValue?.tokenB?.symbol !== token?.symbol
    ) {
      router.push(`/tokens/${makeId(token.path)}`);
    }
    changeTokenA(token);
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
