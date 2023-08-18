import React from "react";
import { FeeWrapper, SwapDivider } from "./SwapCardFeeInfo.styles";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import IconRouter from "@components/common/icons/IconRouter";
import { SwapGasInfo } from "@containers/swap-container/SwapContainer";

interface ContentProps {
  autoRouter: boolean;
  showAutoRouter: () => void;
  swapGasInfo: SwapGasInfo;
}

const SwapCardFeeInfo: React.FC<ContentProps> = ({
  autoRouter,
  showAutoRouter,
  swapGasInfo,
}) => {
  return (
    <FeeWrapper>
      <div className="price-impact">
        <span className="gray-text">Price Impact</span>
        <span className="white-text">{swapGasInfo.priceImpact}</span>
      </div>
      <SwapDivider />
      <div className="received">
        <span className="gray-text">Min. Received</span>
        <span className="white-text">{swapGasInfo.minReceived}</span>
      </div>
      <div className="gas-fee">
        <span className="gray-text">Gas Fee</span>
        <span className="white-text">
          {swapGasInfo.gasFee} GNOT{" "}
          <span className="gray-text">({swapGasInfo.usdExchangeGasFee})</span>
        </span>
      </div>
      <SwapDivider />
      <div className="auto-router">
        <div className="auto-wrapper">
          <IconRouter />
          <h1 className="gradient">Auto Router</h1>
        </div>
        {autoRouter ? (
          <IconStrokeArrowDown
            className="router-icon"
            onClick={showAutoRouter}
          />
        ) : (
          <IconStrokeArrowUp className="router-icon" onClick={showAutoRouter} />
        )}
      </div>
    </FeeWrapper>
  );
};

export default SwapCardFeeInfo;
