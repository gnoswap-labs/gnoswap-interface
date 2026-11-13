import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { LimitOrderSummary } from "@models/order/order-summary";
import { formatOrderPriceDeviation, formatOrderRelativeDuration } from "@utils/order-format-utils";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import { TokenBadge } from "../confirm-dca-order-modal/ConfirmDcaOrderModal";
import OrderInfoRows, { OrderInfoRow } from "../order-info-rows/OrderInfoRows";
import { ValueAnnotation } from "../common/OrderValueAnnotation.styles";

export interface ConfirmLimitOrderModalProps {
  summary: LimitOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

/** A row value followed by a note: `1 GNS = 1.27 GNOT (+10%)`. Without a note it is the plain value. */
const AnnotatedValue: React.FC<{ annotation: string | null; children: string }> = ({ annotation, children }) =>
  annotation ? (
    <span>
      {children} <ValueAnnotation>{annotation}</ValueAnnotation>
    </span>
  ) : (
    <>{children}</>
  );

/** No Figma design exists; it reuses the DCA confirm layout as agreed. */
const ConfirmLimitOrderModal: React.FC<ConfirmLimitOrderModalProps> = ({
  summary,
  isLoading = false,
  confirm,
  close,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { tokenIn, tokenOut } = summary;

  const rows: OrderInfoRow[] = useMemo(() => {
    const deviation = formatOrderPriceDeviation(summary.limitPriceDeviation, locale);
    const expiresIn = formatOrderRelativeDuration(summary.expiryDurationSec, locale);
    const priceNote = deviation ? `(${deviation})` : null;
    const expiryNote = expiresIn ? `(${expiresIn})` : null;

    return [
      {
        key: "limitPrice",
        label: t("Swap:limit.limitPrice"),
        value: <AnnotatedValue annotation={priceNote}>{summary.limitPrice}</AnnotatedValue>,
      },
      {
        key: "expiresAt",
        label: t("Swap:order.expiresAt"),
        value: <AnnotatedValue annotation={expiryNote}>{summary.expiresAt}</AnnotatedValue>,
      },
      { key: "slippage", label: t("Swap:swapInfo.slippageSet"), value: summary.slippage },
      {
        key: "minimumReceived",
        label: t("Swap:swapInfo.minReceived"),
        tooltip: t("Swap:limit.minimumReceivedTooltip"),
        value: summary.minimumReceived ? `${summary.minimumReceived} ${tokenOut.displaySymbol}` : "-",
      },
      {
        key: "executionFee",
        label: t("Swap:dca.executionFee"),
        tooltip: t("Swap:limit.executionFeeTooltip"),
        value: summary.executionFee,
      },
    ];
  }, [locale, summary, t, tokenOut.displaySymbol]);

  return (
    <OrderModalWrapper>
      <div className="modal-header">
        <h6>{t("Modal:confirmPlaceOrder.title")}</h6>
        <div className="close-wrap" onClick={close}>
          <IconClose className="close-icon" />
        </div>
      </div>

      <div className="modal-section-group">
        <div className="modal-section">
          <div className="modal-section-row">
            <span className="amount-text">{summary.sellAmount}</span>
            <TokenBadge symbol={tokenIn.displaySymbol} logoURI={tokenIn.logoURI} />
          </div>
          <span className="sub-text">{summary.sellAmountUsd}</span>
          <div className="arrow">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-section-row">
            <span className="amount-text">{summary.buyAmount}</span>
            <TokenBadge symbol={tokenOut.displaySymbol} logoURI={tokenOut.logoURI} />
          </div>
          <span className="sub-text">{summary.buyAmountUsd}</span>
        </div>
        <div className="modal-section">
          <OrderInfoRows rows={rows} />
        </div>
      </div>

      <Button
        text={t("Modal:confirmPlaceOrder.title")}
        style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
        className="button-confirm"
        onClick={confirm}
        disabled={isLoading}
      />
    </OrderModalWrapper>
  );
};

export default ConfirmLimitOrderModal;
