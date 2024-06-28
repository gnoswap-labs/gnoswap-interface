import React, { useMemo } from "react";
import { ConfirmModal, SwapDivider } from "./ConfirmSwapModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import {
  SwapSummaryInfo,
  swapDirectionToGuaranteedType,
} from "@models/swap/swap-summary-info";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { numberToUSD, toNumberFormat } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { ToolTipContentWrapper } from "../swap-card-fee-info/SwapCardFeeInfo.styles";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";
import { convertSwapRate } from "../swap-card-content-detail/SwapCardContentDetail";

interface ConfirmSwapModalProps {
  submitted: boolean;
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo;
  swapResult: SwapResultInfo | null;
  title: string;
  isWrapOrUnwrap: boolean;

  swap: () => void;
  close: () => void;
}

const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  submitted,
  swapTokenInfo,
  swapSummaryInfo,
  swapResult,
  swap,
  close,
  title,
  isWrapOrUnwrap,
}) => {
  const swapRateDescription = useMemo(() => {
    const { tokenA, tokenB, swapRate } = swapSummaryInfo;
    return (
      <>
        1&nbsp;{tokenA.symbol}&nbsp;=&nbsp;
        <ExchangeRate value={convertSwapRate(swapRate)} />
        &nbsp;{tokenB.symbol}
      </>
    );
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
    return `${toNumberFormat(amount, 6)} ${currency}`;
  }, [swapSummaryInfo.guaranteedAmount]);

  const gasFeeStr = useMemo(() => {
    const { amount, currency } = swapSummaryInfo.gasFee;
    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo.gasFee]);

  const gasFeeUSDStr = useMemo(() => {
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    if (Number(gasFeeUSD) < 0.01) return "<$0.01";

    return `$${toNumberFormat(gasFeeUSD)}`;
  }, [swapSummaryInfo.gasFeeUSD]);

  return (
    <ConfirmModal>
      <div
        className={`modal-body ${
          swapResult === null && submitted
            ? "modal-body-loading"
            : submitted
            ? "submitted-modal"
            : ""
        }`}
      >
        <div className="modal-header">
          <span>{title}</span>
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
                <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
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
            {!isWrapOrUnwrap && (
              <>
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
                <div className="received">
                  <div className="protocol">
                    <div>
                      <span className="">Protocol Fee</span>
                      <Tooltip
                        placement="top"
                        FloatingContent={
                          <ToolTipContentWrapper>
                            The amount of fees charged on each trade that goes
                            to the protocol.
                          </ToolTipContentWrapper>
                        }
                      >
                        <IconInfo />
                      </Tooltip>
                    </div>
                    <span className="white-text">0%</span>
                  </div>
                </div>
              </>
            )}

            <div className="gas-fee">
              <span className="gray-text">Network Gas Fee</span>
              <span className="white-text">
                {gasFeeStr}
                <span className="gray-text">({gasFeeUSDStr})</span>
              </span>
            </div>
          </div>
        </div>
        <div className="modal-button">
          <Button
            text={title}
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
  );
};

export default ConfirmSwapModal;
