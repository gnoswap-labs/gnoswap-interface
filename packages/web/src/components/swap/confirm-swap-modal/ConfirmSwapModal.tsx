import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";

import { SwapState } from "@states/index";
import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapResultInfo } from "@models/swap/swap-result-info";
import { swapDirectionToGuaranteedType } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { floorNumber, toNumberFormat } from "@utils/number-utils";
import { convertToKMBWithPrefix } from "@utils/stake-position-utils";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import ExchangeRate from "@components/common/exchange-rate/ExchangeRate";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { convertSwapRate } from "../swap-card-content-detail/SwapCardContentDetail";
import {
  ConfirmModal,
  PriceImpactStatusWrapper,
  PriceImpactStrWrapper,
  PriceImpactWrapper,
  ToolTipContentWrapper,
} from "./ConfirmSwapModal.styles";
import { formatRouterFeeStr } from "@utils/swap-utils";
import { formatPriceImpact } from "@utils/string-utils";

interface ConfirmSwapModalProps {
  submitted: boolean;
  swapResult: SwapResultInfo | null;
  title: string;
  isWrapOrUnwrap: boolean;
  priceImpactStatus: PriceImpactStatus;
  isLoading: boolean;
  connectedWallet: boolean;

  setSwapRateAction: (type: SwapRateAction) => void;
  swap: (swapTokenInfo: SwapTokenInfo, estimatedAmount: string | null) => void;
  close: () => void;
}

const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  submitted,
  swapResult,
  swap,
  close,
  title,
  setSwapRateAction,
  isWrapOrUnwrap,
  priceImpactStatus,
  isLoading,
  connectedWallet,
}) => {
  const swapConfirmModalState = useAtomValue(SwapState.swapConfirmModalState);
  const { swapSummaryInfo, swapTokenInfo, estimatedAmount, isRefetching } = swapConfirmModalState;

  const { t } = useTranslation();

  const swapRateDescription = useMemo(() => {
    if (!swapSummaryInfo) return;

    const { tokenA, tokenB, swapRate, swapRateAction } = swapSummaryInfo;

    if (swapRateAction === SwapRateAction.ATOB) {
      return (
        <>
          1&nbsp;{tokenA.displaySymbol}&nbsp;=&nbsp;
          <ExchangeRate value={convertSwapRate(swapRate)} />
          &nbsp;{tokenB.displaySymbol}
        </>
      );
    }

    return (
      <>
        1&nbsp;{tokenB.displaySymbol}&nbsp;=&nbsp;
        <ExchangeRate value={convertSwapRate(swapRate)} />
        &nbsp;{tokenA.displaySymbol}
      </>
    );
  }, [swapSummaryInfo]);

  const handleSwapRateDescription = useCallback(() => {
    setSwapRateAction(
      swapSummaryInfo?.swapRateAction === SwapRateAction.ATOB ? SwapRateAction.BTOA : SwapRateAction.ATOB,
    );
  }, [swapSummaryInfo?.swapRateAction]);

  const priceImpactStr = useMemo(() => {
    if (!swapSummaryInfo) return;
    const priceImpact = swapSummaryInfo.priceImpact;
    return `${priceImpact}%`;
  }, [swapSummaryInfo?.priceImpact]);

  const slippageStr = useMemo(() => {
    if (!swapTokenInfo) return;
    const slippage = swapTokenInfo.slippage;
    return `${slippage}%`;
  }, [swapTokenInfo?.slippage]);

  const guaranteedTypeStr = useMemo(() => {
    if (!swapSummaryInfo) return;
    const swapDirection = swapSummaryInfo.swapDirection;
    return t(swapDirectionToGuaranteedType(swapDirection));
  }, [swapSummaryInfo?.swapDirection, t]);

  const guaranteedStr = useMemo(() => {
    if (!swapSummaryInfo) return;
    const { amount, currency } = swapSummaryInfo.guaranteedAmount;
    const guaranteedToken =
      swapSummaryInfo.swapDirection === "EXACT_IN" ? swapSummaryInfo.tokenB : swapSummaryInfo.tokenA;
    return `${toNumberFormat(amount, guaranteedToken.decimals)} ${currency}`;
  }, [swapSummaryInfo]);

  const gasFeeStr = useMemo(() => {
    if (!swapSummaryInfo) return;
    const { amount, currency } = swapSummaryInfo.gasFee;
    return `${toNumberFormat(amount)} ${currency}`;
  }, [swapSummaryInfo?.gasFee]);

  const gasFeeUSDStr = useMemo(() => {
    if (!swapSummaryInfo) return;
    const gasFeeUSD = swapSummaryInfo.gasFeeUSD;

    if (Number(gasFeeUSD) < 0.01) return "<$0.01";

    return `$${toNumberFormat(gasFeeUSD)}`;
  }, [swapSummaryInfo?.gasFeeUSD]);

  const showPriceImpact = useMemo(() => !!swapSummaryInfo?.priceImpact, [swapSummaryInfo?.priceImpact]);

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

  const unitSwapPrice = useMemo(() => {
    if (!swapSummaryInfo || !swapTokenInfo) return "-";

    const { swapRateAction, swapRate } = swapSummaryInfo;
    const { tokenAUSD, tokenBUSD, tokenAAmount, tokenBAmount } = swapTokenInfo;
    if (swapRateAction === SwapRateAction.ATOB) {
      if (!tokenBUSD || tokenBUSD === 0) return "-";
      return convertToKMBWithPrefix(floorNumber((tokenBUSD / Number(tokenBAmount)) * swapRate).toFixed(3), {
        isIgnoreKFormat: true,
        approx: true,
        usd: true,
      });
    } else {
      if (!tokenAUSD || tokenAUSD === 0) return "-";
      return convertToKMBWithPrefix(floorNumber((tokenAUSD / Number(tokenAAmount)) * swapRate).toFixed(3), {
        isIgnoreKFormat: true,
        approx: true,
        usd: true,
      });
    }
  }, [swapSummaryInfo, swapTokenInfo]);

  const routerFeePercentageStr = useMemo(() => {
    if (!swapSummaryInfo?.protocolFee) return null;
    return `(${swapSummaryInfo.protocolFee})`;
  }, [swapSummaryInfo?.protocolFee]);

  const routerFeeStr = useMemo(() => {
    return formatRouterFeeStr(swapSummaryInfo, swapTokenInfo);
  }, [
    swapSummaryInfo?.routerFee,
    swapSummaryInfo?.protocolFee,
    swapTokenInfo?.direction,
    swapTokenInfo?.tokenAAmount,
    swapTokenInfo?.tokenBAmount,
    swapTokenInfo?.tokenAUSD,
    swapTokenInfo?.tokenBUSD,
    swapTokenInfo?.tokenA?.symbol,
    swapTokenInfo?.tokenB?.symbol,
    swapTokenInfo?.tokenADecimals,
    swapTokenInfo?.tokenBDecimals,
  ]);

  const handleSwap = useCallback(() => {
    if (!swapTokenInfo) return;
    swap(swapTokenInfo, estimatedAmount);
  }, [estimatedAmount, swap, swapTokenInfo]);

  const gasEstimateSuccess = useMemo(() => {
    return Boolean(swapSummaryInfo?.gasEstimateSuccess);
  }, [swapSummaryInfo?.gasEstimateSuccess]);

  return (
    <ConfirmModal>
      <div
        className={`modal-body ${
          swapResult === null && submitted ? "modal-body-loading" : submitted ? "submitted-modal" : ""
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
                <span className={swapSummaryInfo?.swapDirection === "EXACT_OUT" && isRefetching ? "loading" : ""}>
                  {swapTokenInfo?.tokenAAmount}
                </span>
                <div className="button-wrapper">
                  <MissingLogo
                    symbol={swapSummaryInfo?.tokenA.symbol || ""}
                    url={swapSummaryInfo?.tokenA.logoURI}
                    className="coin-logo"
                    width={24}
                    mobileWidth={24}
                  />
                  <span>{swapSummaryInfo?.tokenA.displaySymbol || ""}</span>
                </div>
              </div>
              <div className="amount-info">
                <span className="price-text">{swapTokenInfo?.tokenAUSDStr}</span>
              </div>
              <div className="arrow">
                <div className="shape">
                  <IconSwapArrowDown className="shape-icon" />
                </div>
              </div>
            </div>
            <div className="second-section">
              <div className="amount-container">
                <span className={swapSummaryInfo?.swapDirection === "EXACT_IN" && isRefetching ? "loading" : ""}>
                  {swapTokenInfo?.tokenBAmount}
                </span>
                <div className="button-wrapper">
                  <MissingLogo
                    symbol={swapSummaryInfo?.tokenB.symbol || ""}
                    url={swapSummaryInfo?.tokenB.logoURI}
                    className="coin-logo"
                    width={24}
                    mobileWidth={24}
                  />
                  <span>{swapSummaryInfo?.tokenB.displaySymbol || ""}</span>
                </div>
              </div>
              <div className="amount-info">
                <span className="price-text">{swapTokenInfo?.tokenBUSDStr}</span>
                {showPriceImpact && (
                  <PriceImpactWrapper priceImpact={priceImpactStatus}>
                    {formatPriceImpact(swapSummaryInfo?.priceImpact || 0)}
                  </PriceImpactWrapper>
                )}
              </div>
            </div>
          </div>
          <div className="swap-info">
            <div className="coin-info">
              <button className="gnos-price" onClick={handleSwapRateDescription}>
                {swapRateDescription}
              </button>
              <span className="exchange-price">{`(${unitSwapPrice})`}</span>
            </div>
          </div>
          <div className="gas-info">
            {!isWrapOrUnwrap && (
              <>
                <div className="price-impact">
                  <span className="gray-text">{t("Swap:swapInfo.priceImpact")}</span>
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
                  <span className="gray-text">{t("Swap:swapInfo.slippageSet")}</span>
                  <span className="white-text">{slippageStr}</span>
                </div>
                <div className="received">
                  <span className="gray-text">{guaranteedTypeStr}</span>
                  <span className="white-text">{guaranteedStr}</span>
                </div>
                <div className="received">
                  <div className="protocol">
                    <div>
                      <span className="">
                        {t("business:protocolFee.txt")} {routerFeePercentageStr}
                      </span>
                      <Tooltip
                        placement="top"
                        FloatingContent={
                          <ToolTipContentWrapper>{t("Swap:swapInfo.tooltip.swapFee")}</ToolTipContentWrapper>
                        }
                      >
                        <IconInfo />
                      </Tooltip>
                    </div>
                    <span className="white-text">{routerFeeStr}</span>
                  </div>
                </div>
              </>
            )}

            {connectedWallet && gasEstimateSuccess && (
              <div className="gas-fee">
                <span className="gray-text">{t("Swap:swapInfo.gasFee")}</span>
                <span className="white-text">
                  {gasFeeStr}
                  <span className="gray-text">({gasFeeUSDStr})</span>
                </span>
              </div>
            )}
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
            onClick={handleSwap}
            disabled={isRefetching || isLoading}
          />
        </div>
      </div>
    </ConfirmModal>
  );
};

export default ConfirmSwapModal;
