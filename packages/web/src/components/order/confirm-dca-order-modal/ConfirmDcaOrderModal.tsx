import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { DcaOrderSummary } from "@models/order/order-summary";
import { formatOrderTimeUntil } from "@utils/order-format-utils";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import { ValueAnnotation } from "../common/OrderValueAnnotation.styles";
import DcaOrderSentence from "../dca-order-sentence/DcaOrderSentence";
import OrderInfoRows, { OrderInfoRow } from "../order-info-rows/OrderInfoRows";

export interface ConfirmDcaOrderModalProps {
  summary: DcaOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

const ConfirmDcaOrderModal: React.FC<ConfirmDcaOrderModalProps> = ({ summary, isLoading = false, confirm, close }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const { inputToken, outputToken } = summary;

  const rows: OrderInfoRow[] = useMemo(() => {
    const endsIn = formatOrderTimeUntil(summary.estimatedEndAt, locale, nowUnixSeconds);

    return [
      {
        key: "every",
        label: t("Swap:dca.every"),
        tooltip: t("Swap:dca.everyTooltip"),
        value: t(`Swap:dca.intervalPhrase.${summary.intervalUnit}`),
      },
      {
        key: "over",
        label: t("Swap:dca.over"),
        tooltip: t("Swap:dca.overTooltip"),
        value: `${summary.executionCount.toLocaleString(locale)} ${t("Swap:dca.orders")}`,
      },
      {
        key: "estimatedEndDate",
        label: t("Swap:dca.estimatedEndDate"),
        value: endsIn ? (
          <span>
            {summary.estimatedEndDate} <ValueAnnotation>({endsIn})</ValueAnnotation>
          </span>
        ) : (
          summary.estimatedEndDate
        ),
      },
      {
        key: "executionFee",
        label: t("Swap:dca.executionFee"),
        tooltip: t("Swap:dca.executionFeeTooltip"),
        value: summary.executionFee,
      },
    ];
  }, [locale, nowUnixSeconds, summary, t]);

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
            <TokenBadge symbol={inputToken.displaySymbol} logoURI={inputToken.logoURI} />
          </div>
          <span className="sub-text">{summary.sellAmountUsd}</span>
          <div className="arrow">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-section-row">
            <span className="sub-text">{t("Swap:dca.toBuy")}</span>
            <TokenBadge symbol={outputToken.displaySymbol} logoURI={outputToken.logoURI} />
          </div>
        </div>
        <div className="modal-section">
          <OrderInfoRows rows={rows} />
        </div>
        <div className="modal-section">
          <DcaOrderSentence summary={summary} />
        </div>
      </div>

      {summary.actualSellAmount && (
        <span className="notice-text">
          {t("Modal:confirmPlaceOrder.actualAmount", {
            amount: summary.actualSellAmount,
            symbol: inputToken.displaySymbol,
          })}
        </span>
      )}

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

export const TokenBadge: React.FC<{ symbol: string; logoURI?: string }> = ({ symbol, logoURI }) => (
  <span className="token-badge">
    <MissingLogo symbol={symbol} url={logoURI} width={24} mobileWidth={20} />
    {symbol}
  </span>
);

export default ConfirmDcaOrderModal;
