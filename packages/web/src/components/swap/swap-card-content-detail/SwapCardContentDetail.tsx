import React from "react";
import { DetailWrapper } from "./SwapCardContentDetail.styles";
import { TokenInfo } from "../swap-card/SwapCard";
import IconInfo from "@components/common/icons/IconInfo";
import IconNote from "@components/common/icons/IconNote";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import SwapCardFeeInfo from "../swap-card-fee-info/SwapCardFeeInfo";
import SwapCardAutoRouter from "../swap-card-auto-router/SwapCardAutoRouter";
import {
  AutoRouterInfo,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";

interface ContentProps {
  to: TokenInfo;
  from: TokenInfo;
  swapInfo: boolean;
  showSwapInfo: () => void;
  autoRouter: boolean;
  showAutoRouter: () => void;
  swapGasInfo: SwapGasInfo;
  autoRouterInfo: AutoRouterInfo;
}

const SwapCardContentDetail: React.FC<ContentProps> = ({
  to,
  from,
  swapInfo,
  showSwapInfo,
  autoRouter,
  showAutoRouter,
  swapGasInfo,
  autoRouterInfo,
}) => {
  return (
    <DetailWrapper>
      <div className="exchange-section">
        <div className="exchange-container">
          <div className="ocin-info">
            <IconInfo className="icon-info" />
            <span>
              {from.amount} {from.symbol} = {from.gnosExchangePrice} GNOS
            </span>
            <span className="exchange-price">{from.usdExchangePrice}</span>
          </div>
          <div className="price-info">
            <IconNote className="price-icon" />
            <span>{swapGasInfo.usdExchangeGasFee}</span>
            {swapInfo ? (
              <IconStrokeArrowDown
                className="price-icon"
                onClick={showSwapInfo}
              />
            ) : (
              <IconStrokeArrowUp
                className="price-icon"
                onClick={showSwapInfo}
              />
            )}
          </div>
        </div>
        {swapInfo && (
          <SwapCardFeeInfo
            autoRouter={autoRouter}
            showAutoRouter={showAutoRouter}
            swapGasInfo={swapGasInfo}
          />
        )}
        {autoRouter && (
          <SwapCardAutoRouter
            from={from}
            to={to}
            autoRouterInfo={autoRouterInfo}
          />
        )}
      </div>
    </DetailWrapper>
  );
};

export default SwapCardContentDetail;
