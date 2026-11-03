import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { LimitOrderModel } from "@models/order/limit-order-model";
import { formatOrderAmount, formatOrderDate, formatOrderDateTime, formatOrderRate } from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { OrderItemCardWrapper } from "./OrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface LimitOrderItemCardProps {
  order: LimitOrderModel;
  txUrl: string;
  onClickCancel: (order: LimitOrderModel) => void;
  /** Keeps the order actions disabled, e.g. while the order list is served from fixtures. */
  actionsDisabled?: boolean;
  renderHistory: (order: LimitOrderModel) => React.ReactNode;
}

const STATUS_LABEL_KEY: Record<LimitOrderModel["status"], string> = {
  OPEN: "Swap:order.ongoing",
  PARTIALLY_FILLED: "Swap:order.status.partiallyFilled",
  COMPLETED: "Swap:order.status.completed",
  CANCELLED: "Swap:order.status.cancelled",
  EXPIRED: "Swap:order.status.expired",
};

const LimitOrderItemCard: React.FC<LimitOrderItemCardProps> = ({
  order,
  txUrl,
  onClickCancel,
  actionsDisabled = false,
  renderHistory,
}) => {
  const { t } = useTranslation();
  const { tokenIn, tokenOut } = order;

  const metrics: OrderMetric[] = useMemo(
    () => [
      {
        key: "sold",
        label: t("Swap:order.soldAmount"),
        value: `${formatOrderAmount(order.filledInput)} ${tokenIn.displaySymbol}`,
      },
      {
        key: "purchased",
        label: t("Swap:order.purchasedAmount"),
        value: `${formatOrderAmount(order.userOutput)} ${tokenOut.displaySymbol}`,
      },
      { key: "limitPrice", label: t("Swap:order.limitPrice"), value: formatOrderRate(order.limitPrice) },
    ],
    [order, t, tokenIn.displaySymbol, tokenOut.displaySymbol],
  );

  const overview = useMemo(
    () =>
      order.isActive
        ? [
            { label: t("Swap:order.priceRate"), value: formatOrderRate(order.priceRate) },
            { label: t("Swap:order.expiresAt"), value: formatOrderDateTime(order.expiresAt) },
          ]
        : undefined,
    [order.expiresAt, order.isActive, order.priceRate, t],
  );

  return (
    <OrderItemCardWrapper className={cx({ active: order.isActive })}>
      <div className="card-header">
        <OrderPairLabel inputToken={tokenIn} outputToken={tokenOut} linkUrl={txUrl} />
        {order.isActive ? (
          <span className="card-status ongoing">{t(STATUS_LABEL_KEY[order.status])}</span>
        ) : (
          <span className="card-status">
            {`${t(STATUS_LABEL_KEY[order.status])} · ${formatOrderDate(order.closedAt ?? order.expiresAt)}`}
          </span>
        )}
      </div>
      <OrderProgressBar progress={order.progress} overview={overview} />
      <OrderMetrics metrics={metrics} />
      {order.isActive && (
        <div className="card-sub-info">
          <span>{t("Swap:order.expiresAt")}</span>
          <span className="value">{formatOrderDateTime(order.expiresAt)}</span>
        </div>
      )}
      {order.isActive && (
        <OrderStopButton
          text={t("Swap:order.cancelOrder")}
          onClick={() => onClickCancel(order)}
          disabled={actionsDisabled}
        />
      )}
      <OrderHistoryToggle
        visible={BigNumber(order.filledInput).isGreaterThan(0)}
        renderHistory={() => renderHistory(order)}
      />
    </OrderItemCardWrapper>
  );
};

export default LimitOrderItemCard;
