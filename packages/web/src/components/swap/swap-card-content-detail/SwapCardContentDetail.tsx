import React, { useCallback, useMemo, useState } from "react";
import { DetailWrapper, FeelWrapper } from "./SwapCardContentDetail.styles";
import IconNote from "@components/common/icons/IconNote";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import SwapCardFeeInfo from "../swap-card-fee-info/SwapCardFeeInfo";
import SwapCardAutoRouter from "../swap-card-auto-router/SwapCardAutoRouter";
import SwapButtonTooltip from "../swap-button-tooltip/SwapButtonTooltip";
import { DEVICE_TYPE } from "@styles/media";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { useWindowSize } from "@hooks/common/use-window-size";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { formatUsdNumber3Digits } from "@utils/number-utils";
import { convertToKMB } from "@utils/stake-position-utils";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";

interface ContentProps {
  swapSummaryInfo: SwapSummaryInfo;
  swapRouteInfos: SwapRouteInfo[];
  isLoading: boolean;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
}

export const convertSwapRate = (value: number) => {
  if (value >= 0.00001) return value.toFixed(6);
  return value.toFixed(15);
};

const SwapCardContentDetail: React.FC<ContentProps> = ({
  swapSummaryInfo,
  swapRouteInfos,
  isLoading,
  setSwapRateAction,
}) => {
  const { breakpoint } = useWindowSize();
  const [openedDetailInfo, setOpenedDetailInfo] = useState(false);
  const [openedRouteInfo, setOpenedRouteInfo] = useState(false);

  const swapRateDescription = useMemo(() => {
    const { tokenA, tokenB, swapRate, swapRateAction } = swapSummaryInfo;
    if (swapRateAction === "ATOB") {
      return <>1 {tokenA.symbol} =&nbsp;<ExchangeRate value={convertSwapRate(swapRate)} />&nbsp;{tokenB.symbol}</>;
    } else {
      return <>1 {tokenB.symbol} =&nbsp;<ExchangeRate value={convertSwapRate(swapRate)} />&nbsp;{tokenA.symbol}</>;
    }
  }, [swapSummaryInfo]);

  const swapRate1USD = useMemo(() => {
    const swapRate1USD = swapSummaryInfo.swapRate1USD;
    return convertToKMB(formatUsdNumber3Digits(swapRate1USD), { isIgnoreKFormat: true });
  }, [swapSummaryInfo.swapRate1USD]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    if (Number(gasFeeUSD)) {
      return "<$0.01";
    }

    return `$${gasFeeUSD}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  const toggleDetailInfo = useCallback(() => {
    setOpenedDetailInfo(!openedDetailInfo);
  }, [openedDetailInfo]);

  const toggleRouteInfo = useCallback(() => {
    setOpenedRouteInfo(!openedRouteInfo);
  }, [openedRouteInfo]);

  const handleSwapRate = useCallback(() => {
    setSwapRateAction(swapSummaryInfo.swapRateAction === "ATOB" ? "BTOA" : "ATOB");
  }, [swapSummaryInfo.swapRateAction]);

  return (
    <>
      <DetailWrapper opened={openedDetailInfo}>
        <div className="exchange-section">
          <div className="exchange-container">
            {!isLoading && (
              <div className="ocin-info">
                <SwapButtonTooltip swapSummaryInfo={swapSummaryInfo} />
                <span className="swap-rate" onClick={handleSwapRate}>
                  {swapRateDescription}
                </span>
                {breakpoint !== DEVICE_TYPE.MOBILE && (
                  <span className="exchange-price">{`($${swapRate1USD})`}</span>
                )}

              </div>
            )}
            {isLoading && (
              <div className="loading-change">
                <LoadingSpinner /> Fetching Best Price...
              </div>
            )}
            <div className="price-info">
              <IconNote className="price-icon note-icon" />
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
                openedRouteInfo={openedRouteInfo}
                toggleRouteInfo={toggleRouteInfo}
                swapSummaryInfo={swapSummaryInfo}
                isLoading={isLoading}
              />
            )}
            {openedRouteInfo && (
              <SwapCardAutoRouter
                swapRouteInfos={swapRouteInfos}
                swapSummaryInfo={swapSummaryInfo}
                isLoading={isLoading}
              />
            )}
          </div>
        </FeelWrapper>
      )}
    </>
  );
};

export default SwapCardContentDetail;
