import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { SwapCardWrapper } from "./SwapCard.styles";
import SwapCardHeader from "../swap-card-header/SwapCardHeader";
import SwapCardContent from "../swap-card-content/SwapCardContent";
import ConfirmSwapModal from "../confirm-swap-modal/ConfirmSwapModal";
import { TokenModel } from "@models/token/token-model";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapResultInfo } from "@models/swap/swap-result-info";

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
  isSwitchNetwork: boolean,
  isLoading: boolean;

  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string, none?: boolean) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string, none?: boolean) => void;
  changeSlippage: (value: string) => void;

  switchSwapDirection: () => void;
  openConfirmModal: () => void;
  openConnectWallet: () => void;
  closeModal: () => void;
  copyURL: () => void;
  swap: () => void;
  switchNetwork: () => void;
  setSwapRateAction: (type: "ATOB" | "BTOA") => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  connectedWallet,
  copied,
  swapTokenInfo,
  swapSummaryInfo,
  swapRouteInfos,
  isAvailSwap,
  swapButtonText,
  submitted,
  swapResult,
  openedConfirmModal,
  changeTokenA,
  changeTokenAAmount,
  changeTokenB,
  changeTokenBAmount,
  changeSlippage,
  switchSwapDirection,
  openConfirmModal,
  openConnectWallet,
  closeModal,
  copyURL,
  swap,
  themeKey,
  isSwitchNetwork,
  switchNetwork,
  isLoading,
  setSwapRateAction,
}) => {

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
        />
        <div className="footer">
          <SwapButton
            isSwitchNetwork={isSwitchNetwork}
            connectedWallet={connectedWallet}
            isAvailSwap={isAvailSwap}
            openConfirmModal={openConfirmModal}
            openConnectWallet={openConnectWallet}
            text={swapButtonText}
            switchNetwork={switchNetwork}
          />
        </div>
      </SwapCardWrapper>

      {openedConfirmModal && swapSummaryInfo && (
        <ConfirmSwapModal
          submitted={submitted}
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfo}
          swapResult={swapResult}
          swap={swap}
          close={closeModal}
        />
      )}
    </>
  );
};

interface SwapButtonProps {
  connectedWallet: boolean;
  isAvailSwap: boolean;
  text: string;
  isSwitchNetwork: boolean;

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
        className="button-swap"
      />
    );
  }

  if (isSwitchNetwork) {
    return (
      <Button
        text={text}
        style={defaultStyle}
        onClick={switchNetwork}
        className="button-swap"
      />
    );
  }

  if (!isAvailSwap) {
    return (
      <Button
        text={text}
        style={{
          ...defaultStyle,
          hierarchy: ButtonHierarchy.Gray
        }}
      />
    );
  }

  return (
    <Button
      text={text}
      style={defaultStyle}
      onClick={openConfirmModal}
      className="button-swap"
    />
  );
};

export default SwapCard;
