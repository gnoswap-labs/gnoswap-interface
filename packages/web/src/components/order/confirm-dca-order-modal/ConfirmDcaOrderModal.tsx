import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DcaOrderSummary } from "@models/order/order-summary";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import DcaOrderSentence from "../dca-order-sentence/DcaOrderSentence";
import OrderInfoRows, { OrderInfoRow } from "../order-info-rows/OrderInfoRows";

export interface ConfirmDcaOrderModalProps {
  summary: DcaOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

const ConfirmDcaOrderModal: React.FC<ConfirmDcaOrderModalProps> = ({ summary, isLoading = false, confirm, close }) => {
  const { t } = useTranslation();
  const { inputToken } = summary;

  const rows: OrderInfoRow[] = useMemo(
    () => [
      { key: "estimatedEndDate", label: t("Swap:dca.estimatedEndDate"), value: summary.estimatedEndDate },
      {
        key: "executionFee",
        label: t("Swap:dca.executionFee"),
        tooltip: t("Swap:dca.executionFeeTooltip"),
        value: summary.executionFee,
      },
    ],
    [summary, t],
  );

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
          <DcaOrderSentence summary={summary} />
        </div>
        <div className="modal-section">
          <OrderInfoRows rows={rows} />
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
