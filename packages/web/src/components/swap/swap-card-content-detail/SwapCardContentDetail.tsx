import React from "react";
import { DetailWrapper, FeelWrapper } from "./SwapCardContentDetail.styles";
import { TokenInfo } from "../swap-card/SwapCard";
import IconNote from "@components/common/icons/IconNote";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import SwapCardFeeInfo from "../swap-card-fee-info/SwapCardFeeInfo";
import SwapCardAutoRouter from "../swap-card-auto-router/SwapCardAutoRouter";
import {
  AutoRouterInfo,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import SwapButtonTooltip from "../swap-button-tooltip/SwapButtonTooltip";
import { DEVICE_TYPE } from "@styles/media";

interface ContentProps {
  to: TokenInfo;
  from: TokenInfo;
  swapInfo: boolean;
  showSwapInfo: () => void;
  autoRouter: boolean;
  showAutoRouter: () => void;
  swapGasInfo: SwapGasInfo;
  autoRouterInfo: AutoRouterInfo;
  breakpoint: DEVICE_TYPE;
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
  breakpoint,
}) => {
  return (
    <>
      <DetailWrapper swapInfo={swapInfo}>
        <div className="exchange-section">
          <div className="exchange-container">
            <div className="ocin-info">
              <SwapButtonTooltip swapGasInfo={swapGasInfo} />
              <span>
                {from.amount} {from.symbol} = {from.gnosExchangePrice} GNOS
              </span>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <span className="exchange-price">{from.usdExchangePrice}</span>
              )}
            </div>
            <div className="price-info">
              <IconNote className="price-icon" />
              <span>{swapGasInfo.usdExchangeGasFee}</span>
              {swapInfo ? (
                <IconStrokeArrowUp
                  className="price-icon"
                  onClick={showSwapInfo}
                />
              ) : (
                <IconStrokeArrowDown
                  className="price-icon"
                  onClick={showSwapInfo}
                />
              )}
            </div>
          </div>
        </div>
      </DetailWrapper>
      {swapInfo && (
        <FeelWrapper swapInfo={swapInfo}>
          <div className="fee-section">
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
        </FeelWrapper>
      )}
    </>
  );
};

export default SwapCardContentDetail;
