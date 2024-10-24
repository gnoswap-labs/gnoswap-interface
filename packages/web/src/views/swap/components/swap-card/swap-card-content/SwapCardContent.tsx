import BigNumber from "bignumber.js";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { isAmount } from "@common/utils/data-check-util";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { IconTriangleWarningOutlined } from "@components/common/icons/IconTriangleWarningOutlined";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import SwapCardContentDetail from "@components/swap/swap-card-content-detail/SwapCardContentDetail";
import { useTheme } from "@emotion/react";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";

import {
  ContentWrapper,
  PriceImpactWrapper,
  PriceInfoWrapper,
  SwapDetailSectionWrapper
} from "./SwapCardContent.styles";

interface ContentProps {
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  switchSwapDirection: () => void;
  connectedWallet: boolean;
  isLoading: boolean;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
  isSwitchNetwork: boolean;
  priceImpactStatus: PriceImpactStatus;
  isSameToken: boolean;
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
  setSwapRateAction,
  priceImpactStatus,
  isSameToken,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tokenA = swapTokenInfo.tokenA;
  const tokenB = swapTokenInfo.tokenB;
  const direction = swapSummaryInfo?.swapDirection;

  const digitRegex = useMemo(() => /^0+(?=\d)|(\.\d*)$/g, []);

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
      const formatValue = parseFloat(
        swapTokenInfo.tokenABalance.replace(/,/g, ""),
      ).toString();
      changeTokenAAmount(formatValue);
    }
  }, [changeTokenAAmount, connectedWallet, swapTokenInfo]);

  const handleAutoFillTokenB = useCallback(() => {
    if (connectedWallet) {
      const formatValue = parseFloat(
        swapTokenInfo.tokenBBalance.replace(/,/g, ""),
      ).toString();
      changeTokenBAmount(formatValue);
    }
  }, [changeTokenBAmount, connectedWallet, swapTokenInfo]);

  const isShowInfoSection = useMemo(() => {
    return (
      !!(
        swapSummaryInfo &&
        !!Number(swapTokenInfo.tokenAAmount) &&
        !!Number(swapTokenInfo.tokenBAmount)
      ) || isLoading
    );
  }, [swapSummaryInfo, swapTokenInfo, isLoading]);

  const tokenAAmount = useMemo(() => {
    if (swapTokenInfo.tokenAAmount.includes("e")) {
      return BigNumber(swapTokenInfo.tokenAAmount).toFixed(
        tokenA?.decimals ?? 0,
      );
    }

    return swapTokenInfo.tokenAAmount;
  }, [swapTokenInfo.tokenAAmount, tokenA?.decimals]);

  const tokenBAmount = useMemo(() => {
    if (swapTokenInfo.tokenBAmount.includes("e")) {
      return BigNumber(swapTokenInfo.tokenBAmount).toFixed(
        tokenB?.decimals ?? 0,
      );
    }

    return swapTokenInfo.tokenBAmount;
  }, [swapTokenInfo.tokenBAmount, tokenB?.decimals]);

  const showPriceImpact = useMemo(
    () =>
      !isLoading && !!swapSummaryInfo?.priceImpact && swapRouteInfos.length > 0,
    [isLoading, swapRouteInfos.length, swapSummaryInfo?.priceImpact],
  );

  return (
    <ContentWrapper>
      <div className="first-section">
        <div className="amount-container">
          <input
            id={tokenA?.priceID}
            className={`amount-text ${
              isLoading && direction !== "EXACT_IN" ? "text-opacity" : ""
            }`}
            value={tokenAAmount}
            onChange={onChangeTokenAAmount}
            placeholder="0"
          />
          <div className="token-selector">
            <SelectPairButton token={tokenA} changeToken={changeTokenA} />
          </div>
        </div>
        <div className="amount-info">
          <span
            className={`price-text ${
              isLoading && direction !== "EXACT_IN" ? "text-opacity" : ""
            }`}
          >
            {swapTokenInfo.tokenAUSDStr}
          </span>
          <span
            className={`balance-text ${
              tokenA && connectedWallet && "balance-text-disabled"
            }`}
            onClick={handleAutoFillTokenA}
          >
            {t("business:balance")}: {swapTokenInfo.tokenABalance}
          </span>
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
            className={`amount-text ${
              isLoading && direction === "EXACT_IN" ? "text-opacity" : ""
            }`}
            value={tokenBAmount}
            onChange={onChangeTokenBAmount}
            placeholder="0"
          />
          <div className="token-selector">
            <SelectPairButton token={tokenB} changeToken={changeTokenB} />
          </div>
        </div>
        <div className="amount-info">
          <PriceInfoWrapper>
            <span
              className={`price-text ${
                isLoading && direction === "EXACT_IN" ? "text-opacity" : ""
              }`}
            >
              {swapTokenInfo.tokenBUSDStr}
            </span>
            {showPriceImpact && (
              <PriceImpactWrapper priceImpact={priceImpactStatus}>
                {priceImpactStatus === "HIGH" && (
                  <IconTriangleWarningOutlined stroke={theme.color.red01} />
                )}
                {"("}
                {(swapSummaryInfo?.priceImpact || 0) > 0 ? "+" : ""}
                {swapSummaryInfo?.priceImpact}
                {"%)"}
              </PriceImpactWrapper>
            )}
          </PriceInfoWrapper>
          <span
            className={`balance-text ${
              tokenB && connectedWallet && "balance-text-disabled"
            }`}
            onClick={handleAutoFillTokenB}
          >
            {t("business:balance")}: {swapTokenInfo.tokenBBalance}
          </span>
        </div>
      </div>
      {!isSameToken && (
        <SwapDetailSectionWrapper>
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
        </SwapDetailSectionWrapper>
      )}
    </ContentWrapper>
  );
};

export default SwapCardContent;
