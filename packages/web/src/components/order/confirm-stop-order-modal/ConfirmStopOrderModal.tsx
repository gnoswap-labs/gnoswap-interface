import { useTheme } from "@emotion/react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import WarningCard from "@components/common/warning-card/WarningCard";
import { StopOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";

import { OrderModalWrapper } from "../common/OrderModal.styles";
import OrderInfoRows, { OrderInfoRow } from "../order-info-rows/OrderInfoRows";
import OrderPairLabel from "../order-pair-label/OrderPairLabel";
import { ImportantNoteContent, StopOrderContent } from "./ConfirmStopOrderModal.styles";

export interface ConfirmStopOrderModalProps {
  summary: StopOrderSummary;
  isLoading?: boolean;
  confirm: () => void;
  close: () => void;
}

const TokenAmount: React.FC<{ token: TokenModel; children: React.ReactNode }> = ({ token, children }) => (
  <span className="token-amount">
    <MissingLogo symbol={token.symbol} url={token.logoURI} width={24} mobileWidth={20} />
    {children}
  </span>
);

/** Confirms stopping a DCA order or cancelling a limit order. */
const ConfirmStopOrderModal: React.FC<ConfirmStopOrderModalProps> = ({
  summary,
  isLoading = false,
  confirm,
  close,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { inputToken, outputToken } = summary;
  const isDca = summary.kind === "dca";

  const rows: OrderInfoRow[] = useMemo(
    () => [
      {
        key: "sold",
        label: t("Swap:order.soldAmount"),
        value: <TokenAmount token={inputToken}>{`${summary.soldAmount} ${inputToken.displaySymbol}`}</TokenAmount>,
        subValue: summary.soldAmountUsd,
      },
      {
        key: "purchased",
        label: t("Swap:order.purchasedAmount"),
        value: (
          <TokenAmount token={outputToken}>{`${summary.purchasedAmount} ${outputToken.displaySymbol}`}</TokenAmount>
        ),
        subValue: summary.purchasedAmountUsd,
      },
      {
        key: "rate",
        label: t("Swap:order.priceRate"),
        value: (
          <TokenAmount token={inputToken}>
            {`1 ${inputToken.displaySymbol} = ${summary.priceRate} ${outputToken.displaySymbol}`}
          </TokenAmount>
        ),
        subValue: summary.priceRateUsd,
      },
      {
        key: "remaining",
        label: t("Swap:order.remainingAmount"),
        value: <TokenAmount token={inputToken}>{`${summary.remainingAmount} ${inputToken.displaySymbol}`}</TokenAmount>,
        subValue: summary.remainingAmountUsd,
      },
    ],
    [inputToken, outputToken, summary, t],
  );

  return (
    <OrderModalWrapper>
      <div className="modal-header">
        <h6>{isDca ? t("Modal:confirmStopOrder.title") : t("Modal:confirmStopOrder.cancelTitle")}</h6>
        <div className="close-wrap" onClick={close}>
          <IconClose className="close-icon" />
        </div>
      </div>

      <StopOrderContent>
        <span className="section-title">{t("Swap:order.order")}</span>
        <div className="modal-section">
          <div className="order-summary">
            <div className="order-heading">
              <OrderPairLabel inputToken={inputToken} outputToken={outputToken} />
              <span className="order-status">{summary.statusLabel}</span>
            </div>
            <span>{summary.purchasedAmountUsd}</span>
          </div>
        </div>
      </StopOrderContent>

      <StopOrderContent>
        <span className="section-title">{t("Modal:confirmStopOrder.orderDetails")}</span>
        <div className="modal-section">
          <OrderInfoRows rows={rows} />
        </div>
      </StopOrderContent>

      <WarningCard
        type="Warning"
        title={t("Modal:confirmStopOrder.importantNote")}
        icon={<IconInfo size={16} fill={theme.color.text33} />}
        content={
          <ImportantNoteContent>
            {isDca ? t("Modal:confirmStopOrder.note") : t("Modal:confirmStopOrder.cancelNote")}
          </ImportantNoteContent>
        }
      />

      <Button
        text={isDca ? t("Modal:confirmStopOrder.confirm") : t("Modal:confirmStopOrder.cancelConfirm")}
        style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
        className="button-confirm"
        onClick={confirm}
        disabled={isLoading}
      />
    </OrderModalWrapper>
  );
};

export default ConfirmStopOrderModal;
