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
import { FontsKey } from "@constants/font.constant";

interface SwapCardProps {
  connectedWallet: boolean;
  copied: boolean;
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo | null;
  swapRouteInfos: SwapRouteInfo[];
  isAvailSwap: boolean;
  swapError?: string | null;
  submitted: boolean;
  swapResult: SwapResultInfo | null;
  openedConfirmModal: boolean;

  changeTokenA: (token: TokenModel) => void;
  changeTokenAAmount: (value: string) => void;
  changeTokenB: (token: TokenModel) => void;
  changeTokenBAmount: (value: string) => void;
  changeSlippage: (value: string) => void;

  switchSwapDirection: () => void;
  openConfirmModal: () => void;
  openConnectWallet: () => void;
  closeModal: () => void;
  copyURL: () => void;
  swap: () => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  connectedWallet,
  copied,
  swapTokenInfo,
  swapSummaryInfo,
  swapRouteInfos,
  isAvailSwap,
  swapError,
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
}) => {

  return (
    <>
      <SwapCardWrapper>
        <SwapCardHeader
          copied={copied}
          copyURL={copyURL}
          slippage={swapTokenInfo.slippage}
          changeSlippage={changeSlippage}
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
        />
        <div className="footer">
          <SwapButton
            connectedWallet={connectedWallet}
            isAvailSwap={isAvailSwap}
            openConfirmModal={openConfirmModal}
            openConnectWallet={openConnectWallet}
            swapError={swapError}
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
  swapError?: string | null;
  openConfirmModal: () => void;
  openConnectWallet: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  connectedWallet,
  isAvailSwap,
  swapError,
  openConfirmModal,
  openConnectWallet,
}) => {

  const defaultStyle = {
    fullWidth: true,
    fontType: "body7" as FontsKey,
    hierarchy: ButtonHierarchy.Primary,
    height: 56,
  };

  if (!connectedWallet) {
    return (
      <Button
        text="ConnectWallet"
        style={defaultStyle}
        onClick={openConnectWallet}
      />
    );
  }

  if (!isAvailSwap) {
    return (
      <Button
        text={swapError || "Insufficient Balance"}
        style={{
          ...defaultStyle,
          hierarchy: ButtonHierarchy.Gray
        }}
      />
    );
  }

  return (
    <Button
      text="Swap"
      style={defaultStyle}
      onClick={openConfirmModal}
    />
  );
};

export default SwapCard;
