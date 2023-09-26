import React, { useEffect, useRef } from "react";
import {
  ConfirmSwapModalBackground,
  ConfirmModal,
  SwapDivider,
} from "./ConfirmSwapModal.styles";
import {
  SwapData,
  SwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import { TokenInfo } from "../swap-card/SwapCard";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconInfo from "@components/common/icons/IconInfo";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";
import IconSuccess from "@components/common/icons/IconSuccess";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconFailed from "@components/common/icons/IconFailed";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface ConfirmSwapModalProps {
  onConfirmModal: () => void;
  submitSwap: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  from: TokenInfo;
  to: TokenInfo;
  swapGasInfo: SwapGasInfo;
  breakpoint: DEVICE_TYPE;
  tolerance: string;
  submit: boolean;
  isFetching: boolean;
  swapResult?: SwapData;
}

const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  onConfirmModal,
  submitSwap,
  from,
  to,
  swapGasInfo,
  breakpoint,
  tolerance,
  submit,
  isFetching,
  swapResult,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onConfirmModal();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [menuRef, onConfirmModal]);

  return (
    <ConfirmSwapModalBackground>
      <ConfirmModal ref={menuRef}>
        <div className="modal-body">
          <div className="modal-header">
            <span>Confirm Swap</span>
            <div className="close-wrap" onClick={onConfirmModal}>
              <IconClose className="close-icon" />
            </div>
          </div>
          {submit ? (
            <>
              {isFetching && (
                <>
                  <div className="animation">
                    <LoadingSpinner />
                  </div>
                  <div className="transaction-state">
                    <span className="submitted">Waiting for Confirmation</span>
                    <span className="swap-message">
                      Swapping 0.1 GNOS for 0.12 GNOT
                    </span>
                    <div className="view-transaction">
                      <span>Confirm this transaction in your wallet</span>
                    </div>
                  </div>
                </>
              )}
              {!isFetching && swapResult?.success && (
                <>
                  <div className="animation">
                    <IconSuccess className="animation-logo" />
                  </div>
                  <div className="transaction-state">
                    <span className="submitted">Transaction Submitted</span>
                    <div className="view-transaction">
                      <span>View Transaction</span>
                      <div
                        className="open-link"
                        onClick={() => {
                          window.open(swapResult?.transaction, "_blank");
                        }}
                      >
                        <IconOpenLink className="open-logo" />
                      </div>
                    </div>
                  </div>
                  <div className="close-button">
                    <Button
                      text="Close"
                      style={{
                        fullWidth: true,
                        height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
                        fontType: "body7",
                        hierarchy: ButtonHierarchy.Primary,
                      }}
                      onClick={onConfirmModal}
                    />
                  </div>
                </>
              )}
              {!isFetching && !swapResult?.success && (
                <>
                  <div className="animation">
                    <IconFailed className="animation-logo" />
                  </div>
                  <div className="transaction-state">
                    <span className="submitted">Transaction Rejected</span>
                    <div className="view-transaction">
                      <span>
                        Your transaction has been rejected. Please try again.
                      </span>
                    </div>
                  </div>
                  <div className="close-button">
                    <Button
                      text="Close"
                      style={{
                        fullWidth: true,
                        height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
                        fontType: "body7",
                        hierarchy: ButtonHierarchy.Primary,
                      }}
                      onClick={onConfirmModal}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="modal-receipt">
                <div className="input-group">
                  <div className="first-section">
                    <div className="amount-container">
                      <span>{from.amount}</span>
                      <div className="button-wrapper">
                        <img
                          src={from.logoURI}
                          alt="logo"
                          className="coin-logo"
                        />
                        <span>{from.symbol}</span>
                      </div>
                    </div>
                    <div className="amount-info">
                      <span className="price-text">{from.price}</span>
                    </div>
                    <div className="arrow">
                      <div className="shape">
                        <IconSwapArrowDown className="shape-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="second-section">
                    <div className="amount-container">
                      <span>{to.amount}</span>
                      <div className="button-wrapper">
                        <img
                          src={to.logoURI}
                          alt="logo"
                          className="coin-logo"
                        />
                        <span>{to.symbol}</span>
                      </div>
                    </div>
                    <div className="amount-info">
                      <span className="price-text">{to.price}</span>
                    </div>
                  </div>
                </div>
                <div className="swap-info">
                  <div className="ocin-info">
                    <IconInfo className="icon-info" />
                    <span className="gnos-price">
                      {from.amount} {from.symbol} = {from.gnosExchangePrice}{" "}
                      GNOS
                    </span>
                    <span className="exchange-price">
                      {from.usdExchangePrice}
                    </span>
                  </div>
                </div>
                <div className="gas-info">
                  <div className="price-impact">
                    <span className="gray-text">Price Impact</span>
                    <span className="white-text">
                      {swapGasInfo.priceImpact}
                    </span>
                  </div>
                  <div className="slippage">
                    <span className="gray-text">Max. Slippage</span>
                    <span className="white-text">{tolerance}%</span>
                  </div>
                  <SwapDivider />
                  <div className="received">
                    <span className="gray-text">Min. Received</span>
                    <span className="white-text">
                      {swapGasInfo.minReceived}
                    </span>
                  </div>
                  <div className="gas-fee">
                    <span className="gray-text">Gas Fee</span>
                    <span className="white-text">
                      {swapGasInfo.gasFee} GNOT{" "}
                      <span className="gray-text">
                        ({swapGasInfo.usdExchangeGasFee})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-button">
                <Button
                  text="Confrim Swap"
                  style={{
                    fullWidth: true,
                    height: breakpoint === DEVICE_TYPE.MOBILE ? 41 : 57,
                    fontType: "body7",
                    hierarchy: ButtonHierarchy.Primary,
                  }}
                  onClick={submitSwap}
                />
              </div>
            </>
          )}
        </div>
      </ConfirmModal>
    </ConfirmSwapModalBackground>
  );
};

export default ConfirmSwapModal;
