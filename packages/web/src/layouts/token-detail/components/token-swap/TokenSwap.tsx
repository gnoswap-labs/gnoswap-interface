import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "@emotion/css";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconSettings from "@components/common/icons/IconSettings";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";
import { PriceImpactStatus } from "@hooks/swap/data/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import { DataTokenInfo } from "@models/token/token-swap-model";

import { CopyTooltip, wrapper } from "./TokenSwap.styles";
import IconWallet from "@components/common/icons/IconWallet";

export interface TokenSwapProps {
  isSwitchNetwork: boolean;
  connected: boolean;
  copied: boolean;
  themeKey: "dark" | "light";
  dataTokenInfo: DataTokenInfo;
  isLoading: boolean;
  swapButtonText: string;
  isAvailSwap: boolean;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  swapTokenInfo: SwapTokenInfo;
  isRefetching: boolean;

  swapNow: () => void;
  handleSetting: () => void;
  handleCopied: () => void;
  connectWallet: () => void;
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
  priceImpactStatus: PriceImpactStatus;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  connected,
  connectWallet,
  swapNow,
  copied,
  handleCopied,
  themeKey,
  handleSetting,
  isSwitchNetwork,
  dataTokenInfo,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  isLoading,
  swapButtonText,
  isAvailSwap,
  swapSummaryInfo,
  swapRouteInfos,
  setSwapRateAction,
  priceImpactStatus,
  swapTokenInfo,
  isRefetching,
}) => {
  const { t } = useTranslation();
  const tokenA = dataTokenInfo.tokenA;
  const tokenB = dataTokenInfo.tokenB;
  const direction = swapSummaryInfo?.swapDirection;

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenAAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenAAmount],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenBAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
    },
    [changeTokenBAmount],
  );

  const handleAutoFillTokenA = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(dataTokenInfo.tokenABalance.replace(/,/g, "")).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connected, dataTokenInfo]);

  /**
   * Ensure tokenABalance is a valid value (not empty (“-”) or zero)
   * Note: Consider using includes when you have more than 3 comparisons
   * return !(["-", "0", "undefined"].includes(swapTokenInfo.tokenABalance));
   */
  const hasTokenABalance = useMemo(() => {
    return swapTokenInfo.tokenABalance !== "-" && swapTokenInfo.tokenABalance !== "0";
  }, [swapTokenInfo.tokenABalance]);

  const onClickConfirm = useCallback(() => {
    if (!connected || isSwitchNetwork) {
      connectWallet();
      return;
    }
    swapNow();
  }, [connected, connectWallet, swapNow, isSwitchNetwork]);

  const isShowInfoSection = useMemo(() => {
    return (!!Number(dataTokenInfo.tokenAAmount) && !!Number(dataTokenInfo.tokenBAmount)) || isLoading;
  }, [dataTokenInfo, isLoading]);

  const isLoadingTokenA = useMemo((): boolean => {
    return (isLoading && direction !== "EXACT_IN") || (isRefetching && direction === "EXACT_OUT");
  }, [isLoading, direction, isRefetching]);

  const isLoadingTokenB = useMemo((): boolean => {
    return (isLoading || isRefetching) && direction === "EXACT_IN";
  }, [isLoading, direction, isRefetching]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">{t("common:action.swap")}</span>
        <div className="header-button">
          <button className="setting-button link-button" onClick={handleCopied}>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>{t("common:swapUrlCopied")}</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </button>
          <button className="setting-button" onClick={handleSetting}>
            <IconSettings className="setting-icon" />
          </button>
        </div>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className={cx("amount-text", {
                "text-opacity": isLoadingTokenA,
              })}
              aria-busy={isLoadingTokenA}
              value={dataTokenInfo.tokenAAmount}
              onChange={onChangeTokenAAmount}
              placeholder="0"
              autoComplete={"off"}
              spellCheck={"false"}
            />
            <div className="token">
              <SelectPairButton token={tokenA} changeToken={changeTokenA} />
            </div>
          </div>
          <div className="info">
            <span className={cx("price-text", { "text-opacity": isLoadingTokenA })} aria-busy={isLoadingTokenA}>
              {dataTokenInfo.tokenAUSDStr}
            </span>
            <div className="balance-wrapper">
              {connected && <IconWallet />}
              <span className={`balance-text ${tokenA && connected && "balance-text-disabled"}`}>
                {dataTokenInfo.tokenABalance}
              </span>
              {hasTokenABalance && (
                <button className="balance-max-button" onClick={handleAutoFillTokenA}>
                  {t("common:max")}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className={cx("amount-text", { "text-opacity": isLoadingTokenB })}
              aria-busy={isLoadingTokenB}
              value={dataTokenInfo.tokenBAmount}
              onChange={onChangeTokenBAmount}
              placeholder="0"
              autoComplete={"off"}
              spellCheck={"false"}
            />
            <div className="token">
              <SelectPairButton token={tokenB} changeToken={changeTokenB} />
            </div>
          </div>
          <div className="info">
            <span className={cx("price-text", { "text-opacity": isLoadingTokenB })} aria-busy={isLoadingTokenB}>
              {dataTokenInfo.tokenBUSDStr}
            </span>
            <div className="balance-wrapper">
              {connected && <IconWallet />}
              <span className={`balance-text ${tokenB && connected && "balance-text-disabled"}`}>
                {dataTokenInfo.tokenBBalance}
              </span>
            </div>
          </div>
        </div>
        <div className="arrow" onClick={switchSwapDirection}>
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>
      {swapSummaryInfo && isShowInfoSection && (
        <SwapCardContentDetail
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
          isLoading={isLoading}
          setSwapRateAction={setSwapRateAction}
          priceImpactStatus={priceImpactStatus}
          swapTokenInfo={swapTokenInfo}
        />
      )}
      <div className="footer">
        <Button
          text={swapButtonText}
          style={{
            fullWidth: true,
            hierarchy: ButtonHierarchy.Primary,
          }}
          disabled={!isAvailSwap}
          onClick={onClickConfirm}
          className="confirm-button"
        />
      </div>
    </div>
  );
};

export default TokenSwap;
