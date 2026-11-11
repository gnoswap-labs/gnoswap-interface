import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { LimitOrderModel } from "@models/order/limit-order-model";
import {
  formatBps,
  formatOrderAmount,
  formatOrderDate,
  formatOrderDateTime,
  formatOrderFullAmount,
  formatOrderRate,
} from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { OrderItemCardWrapper } from "./OrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface LimitOrderItemCardProps {
  order: LimitOrderModel;
  txUrl: string;
  onClickCancel: (order: LimitOrderModel) => void;
  withdrawHalted?: boolean;
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
  withdrawHalted = false,
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
      { key: "limitPrice", label: t("Swap:limit.limitPrice"), value: formatOrderRate(order.limitPrice) },
    ],
    [order, t, tokenIn.displaySymbol, tokenOut.displaySymbol],
  );

  const overview = useMemo(
    () =>
      order.isActive
        ? [
            {
              label: t("Swap:order.soldAmount"),
              value: `${formatOrderFullAmount(order.filledInput, tokenIn.decimals)} / ${formatOrderFullAmount(
                order.makingAmount,
                tokenIn.decimals,
              )} ${tokenIn.displaySymbol} (${formatOrderAmount(order.progress)}%)`,
            },
            { label: t("Swap:order.expiresAt"), value: formatOrderDateTime(order.expiresAt) },
          ]
        : undefined,
    [order.expiresAt, order.filledInput, order.isActive, order.makingAmount, order.progress, t, tokenIn],
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
      <div className="card-order-terms">
        <div className="card-sub-info">
          <span>{t("Swap:swapInfo.slippageSet")}</span>
          <span className="value">{formatBps(order.slippageBps)}</span>
        </div>
        <div className="card-sub-info">
          <span>{t("Swap:swapInfo.minReceived")}</span>
          <span className="value">
            {formatOrderFullAmount(order.minimumReceived, tokenOut.decimals)} {tokenOut.displaySymbol}
          </span>
        </div>
        <div className="card-sub-info">
          <span>{t("Swap:dca.executionFee")}</span>
          <span className="value">{formatBps(order.executionFeeRate)}</span>
        </div>
        {order.isActive && (
          <div className="card-sub-info">
            <span>{t("Swap:order.expiresAt")}</span>
            <span className="value">{formatOrderDateTime(order.expiresAt)}</span>
          </div>
        )}
      </div>
      {order.canCancel && (
        <>
          <OrderStopButton
            text={t(order.isActive ? "Swap:order.cancelOrder" : "Swap:order.refundOrder")}
            onClick={() => onClickCancel(order)}
            disabled={withdrawHalted}
          />
          {withdrawHalted && (
            <p className="withdrawals-paused" role="status">
              {t("Swap:order.withdrawalsPausedDescription")}
            </p>
          )}
        </>
      )}
      <OrderHistoryToggle
        visible={BigNumber(order.filledInput).isGreaterThan(0)}
        renderHistory={() => renderHistory(order)}
      />
    </OrderItemCardWrapper>
  );
};

export default LimitOrderItemCard;
