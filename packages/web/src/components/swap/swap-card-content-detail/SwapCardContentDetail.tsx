import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";
import { IconGasFilled } from "@components/common/icons/IconsGasFilled";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { DEVICE_TYPE } from "@styles/media";
import { floorNumber, toNumberFormat } from "@utils/number-utils";
import { convertToKMB } from "@utils/stake-position-utils";

import SwapCardAutoRouter from "../swap-card-auto-router/SwapCardAutoRouter";
import SwapCardFeeInfo from "../swap-card-fee-info/SwapCardFeeInfo";
import { DetailWrapper, FeelWrapper } from "./SwapCardContentDetail.styles";

export interface SwapCardContentDetailProps {
  swapSummaryInfo: SwapSummaryInfo;
  swapRouteInfos: SwapRouteInfo[];
  isLoading: boolean;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
  priceImpactStatus: PriceImpactStatus;
  swapTokenInfo: SwapTokenInfo;
}

export const convertSwapRate = (value: number) => {
  if (value >= 0.00001) return value.toFixed(6);
  return value.toFixed(15);
};

const SwapCardContentDetail: React.FC<SwapCardContentDetailProps> = ({
  swapSummaryInfo,
  swapRouteInfos,
  isLoading,
  setSwapRateAction,
  priceImpactStatus,
  swapTokenInfo,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const [openedDetailInfo, setOpenedDetailInfo] = useState(false);

  const swapRateDescription = useMemo(() => {
    const { tokenA, tokenB, swapRate, swapRateAction } = swapSummaryInfo;
    if (swapRateAction === "ATOB") {
      return (
        <>
          1 {tokenA.symbol} =&nbsp;
          <ExchangeRate value={convertSwapRate(swapRate)} />
          &nbsp;{tokenB.symbol}
        </>
      );
    } else {
      return (
        <>
          1 {tokenB.symbol} =&nbsp;
          <ExchangeRate value={convertSwapRate(swapRate)} />
          &nbsp;{tokenA.symbol}
        </>
      );
    }
  }, [swapSummaryInfo]);

  const unitSwapPrice = useMemo(() => {
    const { swapRateAction, swapRate } = swapSummaryInfo;
    const { tokenAUSD, tokenBUSD, tokenAAmount, tokenBAmount } = swapTokenInfo;
    if (swapRateAction === "ATOB") {
      if (!tokenBUSD || tokenBUSD === 0) return "-";
      return convertToKMB(
        floorNumber((tokenBUSD / Number(tokenBAmount)) * swapRate).toFixed(3),
        {
          isIgnoreKFormat: true,
        },
      );
    } else {
      if (!tokenAUSD || tokenAUSD === 0) return "-";
      return convertToKMB(
        floorNumber((tokenAUSD / Number(tokenAAmount)) * swapRate).toFixed(3),
        {
          isIgnoreKFormat: true,
        },
      );
    }
  }, [swapSummaryInfo, swapTokenInfo]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    if (Number(gasFeeUSD) < 0.01) return "<$0.01";

    return `$${toNumberFormat(gasFeeUSD)}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  const toggleDetailInfo = useCallback(() => {
    setOpenedDetailInfo(!openedDetailInfo);
  }, [openedDetailInfo]);

  const handleSwapRate = useCallback(() => {
    setSwapRateAction(
      swapSummaryInfo.swapRateAction === "ATOB" ? "BTOA" : "ATOB",
    );
  }, [swapSummaryInfo.swapRateAction]);

  return (
    <>
      <DetailWrapper opened={openedDetailInfo}>
        <div className="exchange-section">
          <div className="exchange-container">
            {!isLoading && (
              <div className="ocin-info">
                {/* <SwapButtonTooltip swapSummaryInfo={swapSummaryInfo} /> */}
                <span className="swap-rate" onClick={handleSwapRate}>
                  {swapRateDescription}
                </span>
                {breakpoint !== DEVICE_TYPE.MOBILE && (
                  <span className="exchange-price">{`($${unitSwapPrice})`}</span>
                )}
              </div>
            )}
            {isLoading && (
              <div className="loading-change">
                <LoadingSpinner /> {t("Swap:fetchingPrice")}
              </div>
            )}
            <div className="price-info">
              <IconGasFilled className="price-icon note-icon" />
              <span>{gasFeeUSDStr}</span>
              {openedDetailInfo ? (
                <IconStrokeArrowUp
                  className="price-icon"
                  onClick={toggleDetailInfo}
                />
              ) : (
                <IconStrokeArrowDown
                  className="price-icon"
                  onClick={toggleDetailInfo}
                />
              )}
            </div>
          </div>
        </div>
      </DetailWrapper>

      {openedDetailInfo && (
        <FeelWrapper opened={openedDetailInfo}>
          <div className="fee-section">
            {openedDetailInfo && (
              <SwapCardFeeInfo
                swapSummaryInfo={swapSummaryInfo}
                isLoading={isLoading}
                priceImpactStatus={priceImpactStatus}
                swapTokenInfo={swapTokenInfo}
              />
            )}
            <SwapCardAutoRouter
              swapRouteInfos={swapRouteInfos}
              swapSummaryInfo={swapSummaryInfo}
              isLoading={isLoading}
            />
          </div>
        </FeelWrapper>
      )}
    </>
  );
};

export default SwapCardContentDetail;
