import React, { useMemo } from "react";
import { FeeWrapper, SwapDivider } from "./SwapCardFeeInfo.styles";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import IconRouter from "@components/common/icons/IconRouter";
import { SwapSummaryInfo, swapDirectionToGuaranteedType } from "@models/swap/swap-summary-info";
import { toNumberFormat } from "@utils/number-utils";

interface ContentProps {
  openedRouteInfo: boolean;
  toggleRouteInfo: () => void;
  swapSummaryInfo: SwapSummaryInfo;
}

const SwapCardFeeInfo: React.FC<ContentProps> = ({
  openedRouteInfo,
  toggleRouteInfo,
  swapSummaryInfo,
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
    return `${toNumberFormat(amount || 0)} ${currency}`;
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
        <span className="white-text">{priceImpactStr}</span>
      </div>
      <SwapDivider />
      <div className="received">
        <span className="gray-text">{guaranteedTypeStr}</span>
        <span className="white-text">{guaranteedStr}</span>
      </div>
      <div className="gas-fee">
        <span className="gray-text">Gas Fee</span>
        <span className="white-text">
          {gasFeeStr} GNOT
          <span className="gray-text">{`(${gasFeeUSDStr})`}</span>
        </span>
      </div>
      <SwapDivider />
      <div className="auto-router">
        <div className="auto-wrapper">
          <IconRouter />
          <h1 className="gradient">Auto Router</h1>
        </div>

        {openedRouteInfo ?
          <IconStrokeArrowUp className="router-icon" onClick={toggleRouteInfo} /> :
          <IconStrokeArrowDown className="router-icon" onClick={toggleRouteInfo} />}
      </div>
    </FeeWrapper>
  );
};

export default SwapCardFeeInfo;
