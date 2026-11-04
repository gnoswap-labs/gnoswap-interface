import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { LimitOrderSummary } from "@models/order/order-summary";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import { TokenBadge } from "../confirm-dca-order-modal/ConfirmDcaOrderModal";
import OrderInfoRows, { OrderInfoRow } from "../order-info-rows/OrderInfoRows";

export interface ConfirmLimitOrderModalProps {
  summary: LimitOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

/** No Figma design exists; it reuses the DCA confirm layout as agreed. */
const ConfirmLimitOrderModal: React.FC<ConfirmLimitOrderModalProps> = ({
  summary,
  isLoading = false,
  confirm,
  close,
}) => {
  const { t } = useTranslation();
  const { tokenIn, tokenOut } = summary;

  const rows: OrderInfoRow[] = useMemo(
    () => [
      { key: "limitPrice", label: t("Swap:limit.limitPrice"), value: summary.limitPrice },
      { key: "expiry", label: t("Swap:limit.expiry"), value: summary.expiry },
      { key: "expiresAt", label: t("Swap:order.expiresAt"), value: summary.expiresAt },
      { key: "slippage", label: t("Swap:limit.slippage"), value: summary.slippage },
      {
        key: "networkGasFee",
        label: t("Swap:swapInfo.gasFee"),
        value: (
          <>
            {summary.networkGasFee}
            <span className="notice-text">({summary.networkGasFeeUsd})</span>
          </>
        ),
      },
    ],
    [summary, t],
  );

  return (
    <OrderModalWrapper>
      <div className="modal-header">
        <h6>{t("Modal:confirmLimitOrder.title")}</h6>
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
        text={t("Modal:confirmLimitOrder.title")}
        style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
        className="button-confirm"
        onClick={confirm}
        disabled={isLoading}
      />
    </OrderModalWrapper>
  );
};

export default ConfirmLimitOrderModal;
