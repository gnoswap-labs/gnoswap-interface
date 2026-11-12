import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { LimitOrderModel } from "@models/order/limit-order-model";
import {
  formatBps,
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderFullAmount,
  formatOrderRate,
} from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { LimitOrderItemCardWrapper } from "./LimitOrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface LimitOrderItemCardProps {
  order: LimitOrderModel;
  txUrl: string;
  onClickCancel: (order: LimitOrderModel) => void;
  /** Keeps the order actions disabled, e.g. while the order list is served from fixtures. */
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

  const overview = useMemo(() => {
    const inputAmount = (amount: string) =>
      `${formatOrderFullAmount(amount, tokenIn.decimals)} ${tokenIn.displaySymbol}`;
    const outputAmount = (amount: string) =>
      `${formatOrderFullAmount(amount, tokenOut.decimals)} ${tokenOut.displaySymbol}`;

    if (order.isActive) {
      const sold = formatOrderFullAmount(order.filledInput, tokenIn.decimals);
      return [
        {
          label: t("Swap:order.soldAmount"),
          value: `${sold} / ${inputAmount(order.makingAmount)} (${formatOrderAmount(order.progress)}%)`,
        },
        { label: t("Swap:order.remainingAmount"), value: inputAmount(order.remainingInput) },
        { label: t("Swap:order.minimumRemaining"), value: outputAmount(order.minimumRemainingReceived) },
        { label: t("Swap:order.expiresAt"), value: formatOrderDateTime(order.expiresAt) },
      ];
    }

    // A closed order only reports what happened, so no remaining amounts.
    return [
      { label: t("Swap:order.orderAmount"), value: inputAmount(order.makingAmount) },
      { label: t("Swap:order.soldAmount"), value: inputAmount(order.filledInput) },
      { label: t("Swap:order.purchasedAmount"), value: outputAmount(order.userOutput) },
      // The close time the order-api reports. Expiry is no stand-in: an expired order may not be closed yet.
      { label: t("Swap:order.closedAt"), value: formatOrderDateTime(order.closedAt) },
    ];
  }, [order, t, tokenIn, tokenOut]);

  return (
    <LimitOrderItemCardWrapper className={cx({ active: order.isActive })}>
      <div className="card-header">
        <OrderPairLabel
          inputToken={tokenIn}
          outputToken={tokenOut}
          inputAmount={formatOrderFullAmount(order.makingAmount, tokenIn.decimals)}
          outputAmount={formatOrderFullAmount(order.takingAmount, tokenOut.decimals)}
          linkUrl={txUrl}
        />
        <div className="card-status-group">
          <span className={cx("card-status", { ongoing: order.isActive })}>{t(STATUS_LABEL_KEY[order.status])}</span>
          <span className="card-status-time">
            {formatOrderDateTime(order.isActive ? order.expiresAt : order.closedAt)}
          </span>
        </div>
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
        <OrderStopButton
          text={t(order.isActive ? "Swap:order.cancelOrder" : "Swap:order.refundOrder")}
          onClick={() => onClickCancel(order)}
        />
      )}
      <OrderHistoryToggle
        visible={BigNumber(order.filledInput).isGreaterThan(0)}
        renderHistory={() => renderHistory(order)}
      />
    </LimitOrderItemCardWrapper>
  );
};

export default LimitOrderItemCard;
