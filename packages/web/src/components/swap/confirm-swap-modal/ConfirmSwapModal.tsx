import React, { useMemo } from "react";
import {
  ConfirmModal,
  PriceImpactStatusWrapper,
  PriceImpactStrWrapper,
  PriceImpactWrapper,
} from "./ConfirmSwapModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import {
  SwapSummaryInfo,
  swapDirectionToGuaranteedType,
} from "@models/swap/swap-summary-info";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { toNumberFormat } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { ToolTipContentWrapper } from "../swap-card-fee-info/SwapCardFeeInfo.styles";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";
import { convertSwapRate } from "../swap-card-content-detail/SwapCardContentDetail";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";
import { useTheme } from "@emotion/react";
import { IconTriangleWarningOutlined } from "@components/common/icons/IconTriangleWarningOutlined";
import { formatOtherPrice } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";

interface ConfirmSwapModalProps {
  submitted: boolean;
  swapTokenInfo: SwapTokenInfo;
  swapSummaryInfo: SwapSummaryInfo;
  swapResult: SwapResultInfo | null;
  title: string;
  isWrapOrUnwrap: boolean;
  priceImpactStatus: PriceImpactStatus;

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
  priceImpactStatus,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

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
    const swapRateStr = formatOtherPrice(swapSummaryInfo.swapRateUSD, {
      isKMB: false,
    });
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
    return t(swapDirectionToGuaranteedType(swapDirection));
  }, [swapSummaryInfo.swapDirection, t]);

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

  const showPriceImpact = useMemo(
    () => !!swapSummaryInfo?.priceImpact,
    [swapSummaryInfo?.priceImpact],
  );

  const priceImpactStatusDisplay = useMemo(() => {
    switch (priceImpactStatus) {
      case "LOW":
        return t("Swap:priceImpactStatus.low");
      case "MEDIUM":
        return t("Swap:priceImpactStatus.medium");
      case "HIGH":
        return t("Swap:priceImpactStatus.high");
      case "POSITIVE":
        return t("Swap:priceImpactStatus.positive");
      case "NONE":
      default:
        return "";
    }
  }, [priceImpactStatus, t]);

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
                {showPriceImpact && (
                  <PriceImpactWrapper priceImpact={priceImpactStatus}>
                    {priceImpactStatus === "HIGH" && (
                      <IconTriangleWarningOutlined stroke={theme.color.red01} />
                    )}
                    {"("}
                    {(swapSummaryInfo?.priceImpact || 0) > 0 ? "+" : ""}
                    {swapSummaryInfo?.priceImpact}
                    {"%)"}
                  </PriceImpactWrapper>
                )}
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
                  <span className="gray-text">
                    {t("Swap:confirmSwapModal.info.priceImpact")}
                  </span>
                  <span className="white-text">
                    <PriceImpactStatusWrapper priceImpact={priceImpactStatus}>
                      {priceImpactStatusDisplay}
                    </PriceImpactStatusWrapper>{" "}
                    <PriceImpactStrWrapper priceImpact={priceImpactStatus}>
                      {"("}
                      {(swapSummaryInfo?.priceImpact || 0) > 0 ? "+" : ""}
                      {priceImpactStr}
                      {")"}
                    </PriceImpactStrWrapper>
                  </span>
                </div>
                <div className="slippage">
                  <span className="gray-text">
                    {t("Swap:confirmSwapModal.info.slippageSet")}
                  </span>
                  <span className="white-text">{slippageStr}</span>
                </div>
                <div className="received">
                  <span className="gray-text">{guaranteedTypeStr}</span>
                  <span className="white-text">{guaranteedStr}</span>
                </div>
                <div className="received">
                  <div className="protocol">
                    <div>
                      <span className="">{t("business:protocolFee.txt")}</span>
                      <Tooltip
                        placement="top"
                        FloatingContent={
                          <ToolTipContentWrapper>
                            {t("Swap:swapInfo.tooltip.swapFee")}
                          </ToolTipContentWrapper>
                        }
                      >
                        <IconInfo />
                      </Tooltip>
                    </div>
                    <span className="white-text">
                      {swapSummaryInfo.protocolFee}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="gas-fee">
              <span className="gray-text">
                {t("Swap:confirmSwapModal.info.gasFee")}
              </span>
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
