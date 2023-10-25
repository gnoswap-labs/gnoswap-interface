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
import { numberToFormat } from "@utils/string-utils";
import { useWindowSize } from "@hooks/common/use-window-size";

interface ContentProps {
  swapSummaryInfo: SwapSummaryInfo;
  swapRouteInfos: SwapRouteInfo[];
}

const SwapCardContentDetail: React.FC<ContentProps> = ({
  swapSummaryInfo,
  swapRouteInfos,
}) => {
  const { breakpoint } = useWindowSize();
  const [openedDetailInfo, setOpenedDetailInfo] = useState(false);
  const [openedRouteInfo, setOpenedRouteInfo] = useState(false);

  const swapRateDescription = useMemo(() => {
    const { tokenA, tokenB, swapRate } = swapSummaryInfo;
    return `1 ${tokenA.symbol} = ${numberToFormat(swapRate)} ${tokenB.symbol}`;
  }, [swapSummaryInfo]);

  const swapRateUSD = useMemo(() => {
    const swapRateUSD = swapSummaryInfo.swapRateUSD;
    return numberToFormat(swapRateUSD);
  }, [swapSummaryInfo.swapRateUSD]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;
    return `$${gasFeeUSD}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  const toggleDetailInfo = useCallback(() => {
    setOpenedDetailInfo(!openedDetailInfo);
  }, [openedDetailInfo]);

  const toggleRouteInfo = useCallback(() => {
    setOpenedRouteInfo(!openedRouteInfo);
  }, [openedRouteInfo]);

  return (
    <>
      <DetailWrapper opened={openedDetailInfo}>
        <div className="exchange-section">
          <div className="exchange-container">
            <div className="ocin-info">
              <SwapButtonTooltip swapSummaryInfo={swapSummaryInfo} />
              <span>{swapRateDescription}</span>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <span className="exchange-price">{`($${swapRateUSD})`}</span>
              )}
            </div>
            <div className="price-info">
              <IconNote className="price-icon" />
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
              />
            )}
            {openedRouteInfo && (
              <SwapCardAutoRouter
                swapRouteInfos={swapRouteInfos}
              />
            )}
          </div>
        </FeelWrapper>
      )}
    </>
  );
};

export default SwapCardContentDetail;
