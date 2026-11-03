import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DcaOrderSummary } from "@models/order/order-summary";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import OrderInfoRows, { OrderInfoRow, OrderInfoTooltip } from "../order-info-rows/OrderInfoRows";

export interface ConfirmDcaOrderModalProps {
  summary: DcaOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

const ConfirmDcaOrderModal: React.FC<ConfirmDcaOrderModalProps> = ({ summary, isLoading = false, confirm, close }) => {
  const { t } = useTranslation();
  const { inputToken, outputToken } = summary;

  const rows: OrderInfoRow[] = useMemo(
    () => [
      {
        key: "amountPerOrder",
        label: t("Swap:dca.amountPerOrder"),
        value: `${summary.amountPerOrder} ${inputToken.displaySymbol}`,
      },
      { key: "estimatedEndDate", label: t("Swap:dca.estimatedEndDate"), value: summary.estimatedEndDate },
      {
        key: "routerFee",
        label: t("Swap:dca.routerFee"),
        tooltip: t("Swap:dca.routerFeeTooltip"),
        value: summary.routerFee,
      },
      {
        key: "networkGasFee",
        label: t("Swap:dca.networkGasFee"),
        tooltip: t("Swap:dca.networkGasFeeTooltip"),
        value: (
          <>
            {summary.networkGasFee}
            <span className="notice-text">({summary.networkGasFeeUsd})</span>
          </>
        ),
      },
    ],
    [inputToken.displaySymbol, summary, t],
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
            <span className="amount-text">{t("Swap:dca.toBuy")}</span>
            <TokenBadge symbol={outputToken.displaySymbol} logoURI={outputToken.logoURI} />
          </div>
        </div>
        <div className="modal-split">
          <div className="modal-section">
            <span className="sub-text">
              {t("Swap:dca.every")} <OrderInfoTooltip content={t("Swap:dca.everyTooltip")} />
            </span>
            <div className="modal-section-row">
              <span className="amount-text">1</span>
              <span className="token-badge no-logo">{t(`Swap:dca.unit.${summary.intervalUnit}`)}</span>
            </div>
          </div>
          <div className="modal-section">
            <span className="sub-text">
              {t("Swap:dca.over")} <OrderInfoTooltip content={t("Swap:dca.overTooltip")} />
            </span>
            <div className="modal-section-row">
              <span className="amount-text">{summary.executionCount}</span>
              <span className="token-badge no-logo">{t("Swap:dca.orders")}</span>
            </div>
          </div>
        </div>
        <div className="modal-section">
          <span className="sub-text">
            {summary.rate} <span className="notice-text">({summary.rateUsd})</span>
          </span>
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
        text={t("Modal:confirmPlaceOrder.confirm")}
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
