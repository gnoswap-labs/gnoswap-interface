import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import {
  HighPriceWarningContentWrapper,
  SwapCardWrapper,
  SwapWarningSection,
} from "./SwapCard.styles";
import SwapCardHeader from "../swap-card-header/SwapCardHeader";
import SwapCardContent from "../swap-card-content/SwapCardContent";
import { TokenModel } from "@models/token/token-model";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { IconTriangleWarningOutlined } from "@components/common/icons/IconTriangleWarningOutlined";
import { useTheme } from "@emotion/react";
import WarningCard from "@components/common/warning-card/WarningCard";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";

interface SwapCardProps {
  connectedWallet: boolean;
  copied: boolean;
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  isAvailSwap: boolean;
  swapButtonText: string;
  submitted: boolean;
  swapResult: SwapResultInfo | null;
  openedConfirmModal: boolean;
  themeKey: "dark" | "light";
  isSwitchNetwork: boolean;
  isLoading: boolean;
  isSameToken: boolean;

  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  changeSlippage: (value: number) => void;

  switchSwapDirection: () => void;
  openConfirmModal: () => void;
  openConnectWallet: () => void;
  closeModal: () => void;
  copyURL: () => void;
  swap: () => void;
  switchNetwork: () => void;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
  priceImpactStatus: PriceImpactStatus;
}

const SwapCard: React.FC<SwapCardProps> = ({
  connectedWallet,
  copied,
  swapTokenInfo,
  swapSummaryInfo,
  swapRouteInfos,
  isAvailSwap,
  swapButtonText,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  changeSlippage,
  switchSwapDirection,
  openConfirmModal,
  openConnectWallet,
  copyURL,
  themeKey,
  isSwitchNetwork,
  switchNetwork,
  isLoading,
  setSwapRateAction,
  priceImpactStatus,
  isSameToken,
}) => {
  const theme = useTheme();

  const shouldShowPriceImpactWarning = useMemo(
    () => !isSameToken && !isLoading && priceImpactStatus === "HIGH",
    [isLoading, priceImpactStatus, isSameToken],
  );

  return (
    <>
      <SwapCardWrapper>
        <SwapCardHeader
          copied={copied}
          copyURL={copyURL}
          slippage={swapTokenInfo.slippage}
          changeSlippage={changeSlippage}
          themeKey={themeKey}
        />
        <SwapCardContent
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfo}
          swapRouteInfos={swapRouteInfos}
          changeTokenA={changeTokenA}
          changeTokenAAmount={changeTokenAAmount}
          changeTokenB={changeTokenB}
          changeTokenBAmount={changeTokenBAmount}
          switchSwapDirection={switchSwapDirection}
          connectedWallet={connectedWallet}
          isLoading={isLoading}
          setSwapRateAction={setSwapRateAction}
          isSwitchNetwork={isSwitchNetwork}
          priceImpactStatus={priceImpactStatus}
          isSameToken={isSameToken}
        />
        {shouldShowPriceImpactWarning && (
          <SwapWarningSection>
            <WarningCard
              type={"Error"}
              hasBorder={false}
              content={
                <HighPriceWarningContentWrapper>
                  <IconTriangleWarningOutlined
                    stroke={theme.color.red01}
                    width={"20"}
                    height={"20"}
                  />
                  <p>
                    High price impact! Your trade may result in a sharp change
                    in price.
                  </p>
                </HighPriceWarningContentWrapper>
              }
              icon={<IconTriangleWarningOutlined stroke={theme.color.red01} />}
            />
          </SwapWarningSection>
        )}

        <div className="footer">
          <SwapButton
            isSwitchNetwork={isSwitchNetwork}
            connectedWallet={connectedWallet}
            isAvailSwap={isAvailSwap}
            openConfirmModal={openConfirmModal}
            openConnectWallet={openConnectWallet}
            text={swapButtonText}
            isLoading={isLoading}
            switchNetwork={switchNetwork}
          />
        </div>
      </SwapCardWrapper>
    </>
  );
};

interface SwapButtonProps {
  connectedWallet: boolean;
  isAvailSwap: boolean;
  text: string;
  isSwitchNetwork: boolean;
  isLoading: boolean;

  openConfirmModal: () => void;
  openConnectWallet: () => void;
  switchNetwork: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  connectedWallet,
  isAvailSwap,
  text,
  openConfirmModal,
  openConnectWallet,
  isSwitchNetwork,
  switchNetwork,
  isLoading,
}) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  if (!connectedWallet) {
    return (
      <Button
        text={text}
        style={defaultStyle}
        onClick={openConnectWallet}
        className={`button-swap ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      />
    );
  }

  if (isSwitchNetwork) {
    return (
      <Button
        text={text}
        style={defaultStyle}
        onClick={switchNetwork}
        className={`button-swap ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      />
    );
  }

  if (!isAvailSwap) {
    return (
      <Button
        text={text}
        disabled={isLoading}
        style={{
          ...defaultStyle,
          hierarchy: ButtonHierarchy.Gray,
        }}
      />
    );
  }

  return (
    <Button
      text={text}
      style={defaultStyle}
      onClick={openConfirmModal}
      className={`button-swap ${isLoading ? "loading" : ""}`}
      disabled={isLoading}
    />
  );
};

export default SwapCard;
