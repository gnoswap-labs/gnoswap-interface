import React, { useMemo, useRef } from "react";
import {
  ConfirmSwapModalBackground,
  ConfirmModal,
  SwapDivider,
} from "./ConfirmSwapModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSuccess from "@components/common/icons/IconSuccess";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconFailed from "@components/common/icons/IconFailed";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo, swapDirectionToGuaranteedType } from "@models/swap/swap-summary-info";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { numberToUSD, toNumberFormat } from "@utils/number-utils";
import { numberToFormat } from "@utils/string-utils";
import BigNumber from "bignumber.js";
import { usePositionModal } from "@hooks/common/use-position-modal";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";

interface ConfirmSwapModalProps {
  submitted: boolean;
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo;
  swapResult: SwapResultInfo | null;

  swap: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  close: () => void;
}

const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  submitted,
  swapTokenInfo,
  swapSummaryInfo,
  swapResult,
  swap,
  close,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEscCloseModal(close);
  usePositionModal(menuRef);

  const tokenAAmountStr = useMemo(() => {
    return BigNumber(swapTokenInfo.tokenAAmount).toFormat();
  }, [swapTokenInfo.tokenAAmount]);

  const tokenBAmountStr = useMemo(() => {
    return BigNumber(swapTokenInfo.tokenBAmount).toFormat();
  }, [swapTokenInfo.tokenBAmount]);

  const swapRateDescription = useMemo(() => {
    const { tokenA, tokenB, swapRate } = swapSummaryInfo;
    return `1 ${tokenA.symbol} = ${numberToFormat(swapRate)} ${tokenB.symbol}`;
  }, [swapSummaryInfo]);

  const swapRateUSDStr = useMemo(() => {
    const swapRateStr = numberToUSD(swapSummaryInfo.swapRateUSD);
    return `(${swapRateStr})`;
  }, [swapSummaryInfo.swapRateUSD]);

  const priceImpactStr = useMemo(() => {
    const priceImpact = swapSummaryInfo.priceImpact;
    return `${priceImpact}%`;
  }, [swapSummaryInfo.priceImpact]);

  const slippageStr = useMemo(() => {
    const slippage = swapTokenInfo.slippage;
    return `${slippage}%`;
  }, [swapTokenInfo.slippage]);

  const guaranteedTypeStr = useMemo(() => {
    const swapDirection = swapSummaryInfo.swapDirection;
    return swapDirectionToGuaranteedType(swapDirection);
  }, [swapSummaryInfo.swapDirection]);

  const guaranteedStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    return `${toNumberFormat(amount)} ${currency}`;
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
    <>
      <ConfirmSwapModalBackground>
        <ConfirmModal ref={menuRef}>
          <div className={`modal-body ${swapResult === null && "modal-body-loading"}`}>
            <div className={`modal-header ${submitted ? "model-header-submitted" : ""}`}>
              {!submitted && <span>Confirm Swap</span>}
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            {submitted ? (
              <ConfirmSwapResult
                swapResult={swapResult}
                close={close}
              />
            ) : (
              <>
                <div className="modal-receipt">
                  <div className="input-group">
                    <div className="first-section">
                      <div className="amount-container">
                        <span>{tokenAAmountStr}</span>
                        <div className="button-wrapper">
                          <img
                            src={swapSummaryInfo.tokenA.logoURI}
                            alt="logo"
                            className="coin-logo"
                          />
                          <span>{swapSummaryInfo.tokenA.symbol}</span>
                        </div>
                      </div>
                      <div className="amount-info">
                        <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
                      </div>
                      <div className="arrow">
                        <div className="shape">
                          <IconSwapArrowDown className="shape-icon" />
                        </div>
                      </div>
                    </div>
                    <div className="second-section">
                      <div className="amount-container">
                        <span>{tokenBAmountStr}</span>
                        <div className="button-wrapper">
                          <img
                            src={swapSummaryInfo.tokenB.logoURI}
                            alt="logo"
                            className="coin-logo"
                          />
                          <span>{swapSummaryInfo.tokenB.symbol}</span>
                        </div>
                      </div>
                      <div className="amount-info">
                        <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
                      </div>
                    </div>
                  </div>
                  <div className="swap-info">
                    <div className="coin-info">
                      <span className="gnos-price">
                        {swapRateDescription}
                      </span>
                      <span className="exchange-price">
                        {swapRateUSDStr}
                      </span>
                    </div>
                  </div>
                  <div className="gas-info">
                    <div className="price-impact">
                      <span className="gray-text">Price Impact</span>
                      <span className="white-text">
                        {priceImpactStr}
                      </span>
                    </div>
                    <div className="slippage">
                      <span className="gray-text">Max. Slippage</span>
                      <span className="white-text">{slippageStr}</span>
                    </div>
                    <SwapDivider />
                    <div className="received">
                      <span className="gray-text">{guaranteedTypeStr}</span>
                      <span className="white-text">
                        {guaranteedStr}
                      </span>
                    </div>
                    <div className="gas-fee">
                      <span className="gray-text">Gas Fee</span>
                      <span className="white-text">
                        {gasFeeStr} GNOT
                        <span className="gray-text">
                          ({gasFeeUSDStr})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-button">
                  <Button
                    text="Confirm Swap"
                    style={{
                      fullWidth: true,
                      height: 57,
                      fontType: "body7",
                      hierarchy: ButtonHierarchy.Primary,
                    }}
                    onClick={swap}
                  />
                </div>
              </>
            )}
          </div>
        </ConfirmModal>
      </ConfirmSwapModalBackground>
      <Overlay onClick={close}/>
    </>
  );
};

interface ConfirmSwapResultProps {
  swapResult: SwapResultInfo | null;
  close: () => void;
}

const ConfirmSwapResult: React.FC<ConfirmSwapResultProps> = ({
  swapResult,
  close,
}) => {

  if (swapResult === null) {
    return (
      <>
        <div className="animation">
          <LoadingSpinner />
        </div>
        <div className="transaction-state">
          <span className="submitted">Waiting for Confirmation</span>
          <span className="swap-message">
            Swapping 0.1 GNS for 0.12 GNOT
          </span>
          <div className="view-transaction">
            <span>Confirm this transaction in your wallet</span>
          </div>
        </div>
      </>
    );
  }

  if (swapResult.success) {
    return (
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
                window.open(swapResult?.hash, "_blank");
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
              fontType: "body7",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={close}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="animation">
        <IconFailed className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">Transaction Rejected</span>
        <div className="view-transaction">
          <span>
            Your transaction has been rejected.<br /> Please try again.
          </span>
        </div>
      </div>
      <div className="close-button">
        <Button
          text="Close"
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={close}
        />
      </div>
    </>
  );
};

export default ConfirmSwapModal;
