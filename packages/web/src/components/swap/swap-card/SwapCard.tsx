import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { SwapCardWrapper } from "./SwapCard.styles";
import SearchInput from "@components/common/search-input/SearchInput";
import SwapCardHeader from "../swap-card-header/SwapCardHeader";
import SwapCardContent from "../swap-card-content/SwapCardContent";
import { DEVICE_TYPE } from "@styles/media";
import SwapButtonTooltip from "../swap-button-tooltip/SwapButtonTooltip";
import {
  AutoRouterInfo,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";

export interface TokenInfo {
  token: string;
  symbol: string;
  amount: string;
  price: string;
  gnosExchangePrice: string;
  usdExchangePrice: string;
  balance: string;
  tokenLogo: string;
}

interface SwapCardProps {
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  deviceType: DEVICE_TYPE;
  isConnected: boolean;
  from: TokenInfo;
  to: TokenInfo;
  gnosAmount: string;
  swapInfo: boolean;
  showSwapInfo: () => void;
  autoRouter: boolean;
  showAutoRouter: () => void;
  swapGasInfo: SwapGasInfo;
  autoRouterInfo: AutoRouterInfo;
}

const SwapCard: React.FC<SwapCardProps> = ({
  search,
  keyword,
  deviceType,
  from,
  to,
  gnosAmount,
  isConnected,
  swapInfo,
  showSwapInfo,
  autoRouter,
  showAutoRouter,
  swapGasInfo,
  autoRouterInfo,
}) => {
  return (
    <>
      {deviceType === DEVICE_TYPE.MOBILE && (
        <SearchInput
          width={"100%"}
          height={40}
          value={keyword}
          onChange={search}
          className="tokens-search"
        />
      )}
      <SwapCardWrapper>
        <SwapCardHeader />
        <SwapCardContent
          from={from}
          to={to}
          swapInfo={swapInfo}
          showSwapInfo={showSwapInfo}
          autoRouter={autoRouter}
          showAutoRouter={showAutoRouter}
          swapGasInfo={swapGasInfo}
          autoRouterInfo={autoRouterInfo}
        />
        <div className="footer">
          <SwapButtonTooltip swapGasInfo={swapGasInfo}>
            {isConnected ? (
              Number(gnosAmount) - Number(from.gnosExchangePrice) > 0 ? (
                <Button
                  text="Swap"
                  style={{
                    width: deviceType === DEVICE_TYPE.MOBILE ? 466 : 450,
                    height: 57,
                    fontType: "body7",
                    hierarchy: ButtonHierarchy.Primary,
                  }}
                  onClick={() => {}}
                />
              ) : (
                <Button
                  text="Insufficient Balance"
                  style={{
                    width: deviceType === DEVICE_TYPE.MOBILE ? 466 : 450,
                    height: 57,
                    fontType: "body7",
                    hierarchy: ButtonHierarchy.Gray,
                  }}
                  onClick={showSwapInfo}
                />
              )
            ) : (
              <Button
                text="Connect Wallet"
                style={{
                  width: deviceType === DEVICE_TYPE.MOBILE ? 466 : 450,
                  height: 57,
                  fontType: "body7",
                  hierarchy: ButtonHierarchy.Primary,
                }}
                onClick={() => {}}
              />
            )}
          </SwapButtonTooltip>
        </div>
      </SwapCardWrapper>
    </>
  );
};

export default SwapCard;
