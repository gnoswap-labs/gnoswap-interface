import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ValueAnnotation } from "@components/order/common/OrderValueAnnotation.styles";
import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { LimitOrderModel } from "@models/order/limit-order-model";
import {
  calculatePriceDeviation,
  formatBps,
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderFee,
  formatOrderFeeUsd,
  formatOrderFullAmount,
  formatOrderPriceDeviation,
  formatOrderRate,
  formatOrderTimeUntil,
} from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { LimitOrderItemCardWrapper } from "./LimitOrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface LimitOrderItemCardProps {
  order: LimitOrderModel;
  /** Current output per input, quoted for the order's original making amount. Null without a quote. */
  marketPrice: string | null;
  /** Current USD price of the order's output token, to value the execution fee. Null while unknown. */
  tokenOutUsdPrice?: string | null;
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
  marketPrice,
  tokenOutUsdPrice = null,
  txUrl,
  onClickCancel,
  renderHistory,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const { tokenIn, tokenOut } = order;
  const executionFeeUsd = formatOrderFeeUsd(order.cumulativeExecutionFee, tokenOutUsdPrice);
  const expiresIn = order.isActive ? formatOrderTimeUntil(order.expiresAt, locale, nowUnixSeconds) : null;

  const metrics: OrderMetric[] = useMemo(() => {
    const deviation = formatOrderPriceDeviation(calculatePriceDeviation(order.limitPrice, marketPrice), locale);
    return [
      {
        key: "marketPrice",
        label: t("Swap:limit.currentMarketPrice", { defaultValue: "Market Price" }),
        value: formatOrderRate(marketPrice),
      },
      {
        key: "limitPrice",
        label: t("Swap:limit.triggerPrice", { defaultValue: "Limit Trigger Price" }),
        value: formatOrderRate(order.limitPrice),
        annotation: deviation ? `(≈ ${deviation})` : undefined,
      },
      {
        key: "purchased",
        label: t("Swap:order.purchasedAmount"),
        value: `${formatOrderAmount(order.userOutput)} ${tokenOut.displaySymbol}`,
        annotation: t("Swap:order.filledShare", {
          defaultValue: "{{percent}}% filled",
          percent: formatOrderAmount(order.progress),
        }),
      },
    ];
  }, [locale, marketPrice, order.limitPrice, order.progress, order.userOutput, t, tokenOut.displaySymbol]);

  const overview = useMemo(() => {
    const inputAmount = (amount: string) =>
      `${formatOrderFullAmount(amount, tokenIn.decimals)} ${tokenIn.displaySymbol}`;
    const outputAmount = (amount: string) =>
      `${formatOrderFullAmount(amount, tokenOut.decimals)} ${tokenOut.displaySymbol}`;

    const sold = formatOrderFullAmount(order.filledInput, tokenIn.decimals);
    // Refunded funds are still historically unfilled; remainingInput only tracks funds in escrow.
    const unfilled = BigNumber(order.makingAmount).minus(order.filledInput).toFixed();
    const rows = [
      {
        label: t("Swap:order.soldAmount"),
        value: `${sold} / ${inputAmount(order.makingAmount)} (${formatOrderAmount(order.progress)}%)`,
      },
      { label: t("Swap:order.remainingAmount"), value: inputAmount(unfilled) },
      { label: t("Swap:order.purchasedAmount"), value: outputAmount(order.userOutput) },
    ];

    if (!order.isActive) {
      const label =
        order.status === "EXPIRED"
          ? t("Swap:order.expiredAt")
          : order.status === "CANCELLED"
          ? t("Swap:order.cancelledAt")
          : t("Swap:order.completedAt");
      rows.push({
        label,
        value: formatOrderDateTime(order.status === "EXPIRED" ? order.expiresAt : order.closedAt),
      });
    }
    return rows;
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
          {!order.isActive && <span className="card-status-time">{formatOrderDateTime(order.closedAt)}</span>}
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
          <span>{`${t("Swap:dca.executionFee")} (${formatBps(order.executionFeeRate)})`}</span>
          <span className="value">
            {formatOrderFee(order.cumulativeExecutionFee, tokenOut.decimals)}
            {order.cumulativeExecutionFee !== null && ` ${tokenOut.displaySymbol}`}
            {executionFeeUsd && <span className="value-usd">{` (${executionFeeUsd})`}</span>}
          </span>
        </div>
        {order.isActive && (
          <div className="card-sub-info">
            <span>{t("Swap:order.expiresAt")}</span>
            <span className="value">
              {formatOrderDateTime(order.expiresAt)} {expiresIn && <ValueAnnotation>({expiresIn})</ValueAnnotation>}
            </span>
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
