import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-position-modal";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import {
  swapDirectionToGuaranteedType,
  SwapSummaryInfo,
} from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { numberToUSD, toNumberFormat } from "@utils/number-utils";
import { numberToFormat } from "@utils/string-utils";
import React, { useMemo, useRef } from "react";
import {
  ConfirmModal,
  ConfirmSwapModalBackground,
  SwapDivider,
} from "./ConfirmSwapModal.styles";

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

  if (submitted) return null;

  return (
    <>
      <ConfirmSwapModalBackground>
        <ConfirmModal
          ref={menuRef}
          className={submitted ? "modal-body-wrapper" : ""}
        >
          <div
            className={`modal-body ${
              swapResult === null && submitted
                ? "modal-body-loading"
                : submitted
                ? "submitted-modal"
                : ""
            }`}
          >
            <div
              className={`modal-header ${
                submitted ? "model-header-submitted" : ""
              }`}
            >
              {!submitted && <span>Confirm Swap</span>}
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            <div className="modal-receipt">
              <div className="input-group">
                <div className="first-section">
                  <div className="amount-container">
                    <span>{swapTokenInfo.tokenAAmount}</span>
                    <div className="button-wrapper">
                      <MissingLogo
                        symbol={swapSummaryInfo.tokenA.symbol}
                        url={swapSummaryInfo.tokenA.logoURI}
                        className="coin-logo"
                        width={24}
                        mobileWidth={24}
                      />
                      <span>{swapSummaryInfo.tokenA.symbol}</span>
                    </div>
                  </div>
                  <div className="amount-info">
                    <span className="price-text">
                      {swapTokenInfo.tokenAUSDStr}
                    </span>
                  </div>
                  <div className="arrow">
                    <div className="shape">
                      <IconSwapArrowDown className="shape-icon" />
                    </div>
                  </div>
                </div>
                <div className="second-section">
                  <div className="amount-container">
                    <span>{swapTokenInfo.tokenBAmount}</span>
                    <div className="button-wrapper">
                      <MissingLogo
                        symbol={swapSummaryInfo.tokenB.symbol}
                        url={swapSummaryInfo.tokenB.logoURI}
                        className="coin-logo"
                        width={24}
                        mobileWidth={24}
                      />
                      <span>{swapSummaryInfo.tokenB.symbol}</span>
                    </div>
                  </div>
                  <div className="amount-info">
                    <span className="price-text">
                      {swapTokenInfo.tokenBUSDStr}
                    </span>
                  </div>
                </div>
              </div>
              <div className="swap-info">
                <div className="coin-info">
                  <span className="gnos-price">{swapRateDescription}</span>
                  <span className="exchange-price">{swapRateUSDStr}</span>
                </div>
              </div>
              <div className="gas-info">
                <div className="price-impact">
                  <span className="gray-text">Price Impact</span>
                  <span className="white-text">{priceImpactStr}</span>
                </div>
                <div className="slippage">
                  <span className="gray-text">Max. Slippage</span>
                  <span className="white-text">{slippageStr}</span>
                </div>
                <SwapDivider />
                <div className="received">
                  <span className="gray-text">{guaranteedTypeStr}</span>
                  <span className="white-text">{guaranteedStr}</span>
                </div>
                <div className="gas-fee">
                  <span className="gray-text">Gas Fee</span>
                  <span className="white-text">
                    {gasFeeStr}
                    <span className="gray-text">({gasFeeUSDStr})</span>
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
          </div>
        </ConfirmModal>
      </ConfirmSwapModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default ConfirmSwapModal;
