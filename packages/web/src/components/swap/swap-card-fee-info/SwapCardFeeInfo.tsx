import React, { useMemo } from "react";
import { FeeWrapper, SwapDivider, ToolTipContentWrapper } from "./SwapCardFeeInfo.styles";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import IconRouter from "@components/common/icons/IconRouter";
import {
  SwapSummaryInfo,
  swapDirectionToGuaranteedType,
} from "@models/swap/swap-summary-info";
import { toNumberFormat } from "@utils/number-utils";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

interface ContentProps {
  openedRouteInfo: boolean;
  toggleRouteInfo: () => void;
  swapSummaryInfo: SwapSummaryInfo;
  isLoading: boolean;
}

const SwapCardFeeInfo: React.FC<ContentProps> = ({
  openedRouteInfo,
  toggleRouteInfo,
  swapSummaryInfo,
  isLoading,
}) => {
  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;
    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return swapDirectionToGuaranteedType(swapDirection);
  }, [swapSummaryInfo.swapDirection]);

  const guaranteedStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    return `${toNumberFormat(amount || 0, 6)} ${currency}`;
  }, [swapSummaryInfo.guaranteedAmount]);

  const gasFeeStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;
    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo.gasFee]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;
    return `$${toNumberFormat(gasFeeUSD)}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  return (
    <FeeWrapper>
      <div className="price-impact">
        <span className="gray-text">Price Impact</span>
        {!isLoading ? (
          <span className="white-text">{priceImpactStr}</span>
        ) : (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        )}
      </div>
      <SwapDivider />
      <div className="received">
        <span className="gray-text">{guaranteedTypeStr}</span>
        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">{guaranteedStr}</span>
        )}
      </div>
      <div className="received">
        <div className="protocol">
          <span className="">Protocol Fee</span>
          <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper>The amount of fees charged on each trade that goes to the protocol.</ToolTipContentWrapper>}>
            <IconInfo />
          </Tooltip>
        </div>
        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">0%</span>
        )}
      </div>
      <div className="gas-fee">
        <span className="gray-text">Network Gas Fee</span>

        {isLoading ? (
          <span css={pulseSkeletonStyle({ h: 18, w: "100px!important" })} />
        ) : (
          <span className="white-text">
            {gasFeeStr}
            <span className="gray-text">{`(${gasFeeUSDStr})`}</span>
          </span>
        )}
      </div>
      <SwapDivider />
      <div className="auto-router">
        <div className="auto-wrapper">
          <IconRouter />
          <h1 className="gradient">Auto Router</h1>
        </div>

        {openedRouteInfo ? (
          <IconStrokeArrowUp
            className="router-icon"
            onClick={toggleRouteInfo}
          />
        ) : (
          <IconStrokeArrowDown
            className="router-icon"
            onClick={toggleRouteInfo}
          />
        )}
      </div>
    </FeeWrapper>
  );
};

export default SwapCardFeeInfo;
