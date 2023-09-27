import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { SwapCardWrapper } from "./SwapCard.styles";
import SwapCardHeader from "../swap-card-header/SwapCardHeader";
import SwapCardContent from "../swap-card-content/SwapCardContent";
import {
  AutoRouterInfo,
  tokenInfo,
  SwapData,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import ConfirmSwapModal from "../confirm-swap-modal/ConfirmSwapModal";
import { DEVICE_TYPE } from "@styles/media";

export interface TokenInfo {
  token: string;
  symbol: string;
  amount: string;
  price: string;
  gnosExchangePrice: string;
  usdExchangePrice: string;
  balance: string;
  logoURI: string;
}

interface SwapCardProps {
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
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
  settingMenuToggle: boolean;
  onSettingMenu: () => void;
  tolerance: string;
  changeTolerance: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tokenModal: boolean;
  onSelectTokenModal: () => void;
  swapOpen: boolean;
  onConfirmModal: () => void;
  coinList: tokenInfo[];
  changeToken: (token: tokenInfo, type: string) => void;
  selectToken: (e: string) => void;
  submitSwap: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  breakpoint: DEVICE_TYPE;
  submit: boolean;
  isFetching: boolean;
  swapResult?: SwapData;
  resetTolerance: () => void;
  handleCopyClipBoard: (text: string) => void;
  copied: boolean;
}

const SwapCard: React.FC<SwapCardProps> = ({
  search,
  keyword,
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
  settingMenuToggle,
  onSettingMenu,
  tolerance,
  changeTolerance,
  tokenModal,
  onSelectTokenModal,
  swapOpen,
  onConfirmModal,
  coinList,
  changeToken,
  selectToken,
  submitSwap,
  breakpoint,
  submit,
  isFetching,
  swapResult,
  resetTolerance,
  handleCopyClipBoard,
  copied,
}) => {
  return (
    <>
      <SwapCardWrapper>
        <SwapCardHeader
          settingMenuToggle={settingMenuToggle}
          onSettingMenu={onSettingMenu}
          tolerance={tolerance}
          changeTolerance={changeTolerance}
          resetTolerance={resetTolerance}
          handleCopyClipBoard={handleCopyClipBoard}
          copied={copied}
        />
        <SwapCardContent
          from={from}
          to={to}
          swapInfo={swapInfo}
          showSwapInfo={showSwapInfo}
          autoRouter={autoRouter}
          showAutoRouter={showAutoRouter}
          swapGasInfo={swapGasInfo}
          autoRouterInfo={autoRouterInfo}
          tokenModal={tokenModal}
          onSelectTokenModal={onSelectTokenModal}
          search={search}
          keyword={keyword}
          coinList={coinList}
          changeToken={changeToken}
          selectToken={selectToken}
          breakpoint={breakpoint}
        />
        <div className="footer">
          {isConnected ? (
            Number(gnosAmount) - Number(from.gnosExchangePrice) > 0 ? (
              <Button
                text="Swap"
                style={{
                  fullWidth: true,
                  height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
                  fontType: "body7",
                  hierarchy: ButtonHierarchy.Primary,
                }}
                onClick={onConfirmModal}
              />
            ) : (
              <Button
                text="Insufficient Balance"
                style={{
                  fullWidth: true,
                  height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
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
                fullWidth: true,
                height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
                fontType: "body7",
                hierarchy: ButtonHierarchy.Primary,
              }}
              onClick={() => { }}
            />
          )}
        </div>
      </SwapCardWrapper>
      {swapOpen && (
        <ConfirmSwapModal
          onConfirmModal={onConfirmModal}
          submitSwap={submitSwap}
          from={from}
          to={to}
          swapGasInfo={swapGasInfo}
          tolerance={tolerance}
          breakpoint={breakpoint}
          submit={submit}
          isFetching={isFetching}
          swapResult={swapResult}
        />
      )}
    </>
  );
};

export default SwapCard;
