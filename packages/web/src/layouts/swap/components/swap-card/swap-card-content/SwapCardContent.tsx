import BigNumber from "bignumber.js";
import React, { useCallback, useMemo } from "react";
import { cx } from "@emotion/css";

import { isAmount } from "@common/utils/data-check-util";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { IconTriangleWarningOutlined } from "@components/common/icons/IconTriangleWarningOutlined";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";
import { useTheme } from "@emotion/react";
import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";

import {
  ContentWrapper,
  PriceImpactWrapper,
  PriceInfoWrapper,
  SwapDetailSectionWrapper,
} from "./SwapCardContent.styles";
import IconWallet from "@components/common/icons/IconWallet";
import { useTranslation } from "react-i18next";
import { useTokenBalancesDisplay } from "@hooks/token/ui/use-token-balance-display";
import PriceWarning from "@components/common/price-warning/PriceWarning";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";

interface ContentProps {
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  resetEstimatedLiquidity: () => void;
  connectedWallet: boolean;
  isLoading: boolean;
  isLoadingGasInfo: boolean;
  setSwapRateAction: (type: SwapRateAction) => void;
  isSwitchNetwork: boolean;
  priceImpactStatus: PriceImpactStatus;
  isSameToken: boolean;
  isRefetching: boolean;
}

const SwapCardContent: React.FC<ContentProps> = ({
  swapTokenInfo,
  swapSummaryInfo,
  swapRouteInfos,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  switchSwapDirection,
  connectedWallet,
  isLoading,
  isLoadingGasInfo,
  setSwapRateAction,
  priceImpactStatus,
  isSameToken,
  resetEstimatedLiquidity,
  isRefetching,
}) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const tokenA = swapTokenInfo.tokenA;
  const tokenB = swapTokenInfo.tokenB;
  const direction = swapSummaryInfo?.swapDirection;

  const digitRegex = useMemo(() => /^0+(?=\d)|(\.\d*)$/g, []);

  const { tokenA: balanceADisplay, tokenB: balanceBDisplay } = useTokenBalancesDisplay(
    swapTokenInfo.tokenABalance,
    swapTokenInfo.tokenBBalance,
    connectedWallet,
  );

  const onChangeTokenAAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenAAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenAAmount(value.replace(digitRegex, "$1"));
    },
    [changeTokenAAmount, digitRegex],
  );

  const onChangeTokenBAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeTokenBAmount("", true);
      }
      if (value !== "" && !isAmount(value)) return;
      changeTokenBAmount(value.replace(digitRegex, "$1"));
    },
    [changeTokenBAmount, digitRegex],
  );

  const handleAutoFillTokenA = useCallback(() => {
    if (connectedWallet) {
      resetEstimatedLiquidity();
      const formatValue = parseFloat(swapTokenInfo.tokenABalance.replace(/,/g, "")).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connectedWallet, swapTokenInfo]);

  const isShowInfoSection = useMemo(() => {
    return (
      !!(swapSummaryInfo && !!Number(swapTokenInfo.tokenAAmount) && !!Number(swapTokenInfo.tokenBAmount)) || isLoading
    );
  }, [swapSummaryInfo, swapTokenInfo, isLoading]);

  const tokenAAmount = useMemo(() => {
    if (swapTokenInfo.tokenAAmount.includes("e")) {
      return BigNumber(swapTokenInfo.tokenAAmount).toFixed(tokenA?.decimals ?? 0);
    }

    return swapTokenInfo.tokenAAmount;
  }, [swapTokenInfo.tokenAAmount, tokenA?.decimals]);

  const tokenBAmount = useMemo(() => {
    if (swapTokenInfo.tokenBAmount.includes("e")) {
      return BigNumber(swapTokenInfo.tokenBAmount).toFixed(tokenB?.decimals ?? 0);
    }

    return swapTokenInfo.tokenBAmount;
  }, [swapTokenInfo.tokenBAmount, tokenB?.decimals]);

  /**
   * Ensure tokenABalance is a valid value (not empty (“-”) or zero)
   * Note: Consider using includes when you have more than 3 comparisons
   * return !(["-", "0", "undefined"].includes(swapTokenInfo.tokenABalance));
   */
  const hasTokenABalance = useMemo(() => {
    return swapTokenInfo.tokenABalance !== "-" && swapTokenInfo.tokenABalance !== "0";
  }, [swapTokenInfo.tokenABalance]);

  const showPriceImpact = useMemo(
    () => !isLoading && !!swapSummaryInfo?.priceImpact && swapRouteInfos.length > 0,
    [isLoading, swapRouteInfos.length, swapSummaryInfo?.priceImpact],
  );

  const isLoadingTokenA = useMemo(() => {
    return (isLoading && direction !== "EXACT_IN") || (isRefetching && direction === "EXACT_OUT");
  }, [isLoading, direction, isRefetching]);

  const isLoadingTokenB = useMemo(() => {
    return (isLoading || isRefetching) && direction === "EXACT_IN";
  }, [isLoading, direction, isRefetching]);

  const { priceStyle: tokenAPriceStyle, shouldShowPriceWarning: tokenAShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: swapTokenInfo.tokenAPriceGrade,
  });
  const { priceStyle: tokenBPriceStyle, shouldShowPriceWarning: tokenBShouldShowPriceWarning } = useTokenPriceInfo({
    priceGradeType: swapTokenInfo.tokenBPriceGrade,
  });

  return (
    <ContentWrapper>
      <div className="first-section">
        <div className="amount-container">
          <input
            id={tokenA?.priceID}
            className={cx("amount-text", { "text-opacity": isLoadingTokenA })}
            aria-busy={isLoadingTokenA}
            value={tokenAAmount}
            onChange={onChangeTokenAAmount}
            placeholder="0"
            autoComplete={"off"}
            spellCheck={"false"}
            inputMode={"decimal"}
          />
          <div className="token-selector">
            <SelectPairButton token={tokenA} changeToken={changeTokenA} />
          </div>
        </div>
        <div className="amount-info">
          <span
            className={cx("price-text", tokenAPriceStyle.className, { "text-opacity": isLoadingTokenA })}
            aria-busy={isLoadingTokenA}
          >
            {swapTokenInfo.tokenAUSDStr}
            {tokenAShouldShowPriceWarning && swapTokenInfo.tokenAAmount && <PriceWarning type="PRICE" />}
          </span>
          <div className="balance-wrapper">
            {connectedWallet && <IconWallet />}
            <span className={`balance-text ${tokenA && connectedWallet && "balance-text-disabled"}`}>
              {balanceADisplay}
            </span>
            {hasTokenABalance && (
              <button className="balance-max-button" onClick={handleAutoFillTokenA}>
                {t("common:max")}
              </button>
            )}
          </div>
        </div>
        <div className="arrow">
          <div className="shape" onClick={switchSwapDirection}>
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>
      <div className="second-section">
        <div className="amount-container">
          <input
            id={tokenB?.priceID}
            className={cx("amount-text", { "text-opacity": isLoadingTokenB })}
            aria-busy={isLoadingTokenB}
            value={tokenBAmount}
            onChange={onChangeTokenBAmount}
            placeholder="0"
            autoComplete={"off"}
            spellCheck={"false"}
            inputMode={"decimal"}
          />
          <div className="token-selector">
            <SelectPairButton token={tokenB} changeToken={changeTokenB} />
          </div>
        </div>
        <div className="amount-info">
          <PriceInfoWrapper>
            <span
              className={cx("price-text second-price-text", tokenBPriceStyle.className, {
                "text-opacity": isLoadingTokenB,
              })}
            >
              {swapTokenInfo.tokenBUSDStr}
              {tokenBShouldShowPriceWarning && swapTokenInfo.tokenBAmount && <PriceWarning type="PRICE" />}
            </span>
            {showPriceImpact && (
              <PriceImpactWrapper priceImpact={priceImpactStatus}>
                {priceImpactStatus === "HIGH" && <IconTriangleWarningOutlined stroke={theme.color.red01} />}
                {"("}
                {(swapSummaryInfo?.priceImpact || 0) > 0 ? "+" : ""}
                {swapSummaryInfo?.priceImpact}
                {"%)"}
              </PriceImpactWrapper>
            )}
          </PriceInfoWrapper>
          <div className="balance-wrapper">
            {connectedWallet && <IconWallet />}
            <span className={`balance-text ${tokenB && connectedWallet && "balance-text-disabled"}`}>
              {balanceBDisplay}
            </span>
          </div>
        </div>
      </div>
      {!isSameToken && (
        <SwapDetailSectionWrapper>
          {swapSummaryInfo && isShowInfoSection && (
            <SwapCardContentDetail
              swapSummaryInfo={swapSummaryInfo}
              swapRouteInfos={swapRouteInfos}
              isLoading={isLoading}
              isLoadingGasInfo={isLoadingGasInfo}
              setSwapRateAction={setSwapRateAction}
              priceImpactStatus={priceImpactStatus}
              swapTokenInfo={swapTokenInfo}
              connectedWallet={connectedWallet}
            />
          )}
        </SwapDetailSectionWrapper>
      )}
    </ContentWrapper>
  );
};

export default SwapCardContent;
