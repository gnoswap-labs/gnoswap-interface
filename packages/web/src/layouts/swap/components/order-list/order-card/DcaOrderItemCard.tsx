import { cx } from "@emotion/css";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { DcaOrderModel, getDcaIntervalUnit } from "@models/order/dca-order-model";
import {
  calculateDcaOrderEndAt,
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderRate,
  formatOrderRemainingTime,
} from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { DcaOrderItemCardWrapper } from "./DcaOrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface DcaOrderItemCardProps {
  order: DcaOrderModel;
  roi: { text: string; isNegative: boolean } | null;
  txUrl: string;
  onClickStop: (order: DcaOrderModel) => void;
  /** Pays unclaimed output of an order whose rounds all executed. */
  onClickClaim: (order: DcaOrderModel) => void;
  /** Keeps the order actions disabled, e.g. while the order list is served from fixtures. */
  renderHistory: (order: DcaOrderModel) => React.ReactNode;
}

const STATUS_LABEL_KEY: Record<DcaOrderModel["status"], string> = {
  ACTIVE: "Swap:order.ongoing",
  COMPLETED: "Swap:order.status.completed",
  CANCELLED: "Swap:order.status.cancelled",
};

/**
 * The status of an open order with the time left until its last trade. It owns the minute clock, so a closed card,
 * which counts nothing down, never re-renders for it.
 */
const ActiveDcaOrderStatus: React.FC<{ order: DcaOrderModel }> = ({ order }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const { interval, nextExecutionAt, remainingCount } = order;

  // The end follows from the order's real schedule: without one, or once it has passed, no time is shown.
  const remainingTime = formatOrderRemainingTime(
    calculateDcaOrderEndAt({ nextExecutionAt, interval, remainingCount }),
    locale,
    nowUnixSeconds,
  );

  return (
    <div className="card-status-group">
      <span className="card-status ongoing">{t(STATUS_LABEL_KEY[order.status])}</span>
      {remainingTime && (
        <span className="card-status-time">
          <IconOutlineClock className="icon-clock" />
          {remainingTime}
        </span>
      )}
    </div>
  );
};

const DcaOrderItemCard: React.FC<DcaOrderItemCardProps> = ({
  order,
  roi,
  txUrl,
  onClickStop,
  onClickClaim,
  renderHistory,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { inputToken, outputToken } = order;

  const metrics: OrderMetric[] = useMemo(
    () => [
      {
        key: "sold",
        label: t("Swap:order.soldAmount"),
        value: `${formatOrderAmount(order.soldAmount)} ${inputToken.displaySymbol}`,
      },
      {
        key: "purchased",
        label: t("Swap:order.purchasedAmount"),
        value: `${formatOrderAmount(order.purchasedAmount)} ${outputToken.displaySymbol}`,
        roi,
      },
      { key: "rate", label: t("Swap:order.priceRateAvg"), value: formatOrderRate(order.priceRate) },
    ],
    [inputToken.displaySymbol, order, outputToken.displaySymbol, roi, t],
  );

  const overview = useMemo(
    () =>
      order.isActive
        ? [
            { label: t("Swap:order.nextTrade"), value: formatOrderDateTime(order.nextExecutionAt) },
            { label: t("Swap:order.remainingTrades"), value: `${order.remainingCount}` },
          ]
        : undefined,
    [order.isActive, order.nextExecutionAt, order.remainingCount, t],
  );

  // The terms the order was placed with, not what is left of them. An interval that is none of the allowed units
  // is told in plain seconds.
  const intervalUnit = getDcaIntervalUnit(order.interval);
  const every = intervalUnit
    ? t(`Swap:dca.intervalPhrase.${intervalUnit}`)
    : new Intl.NumberFormat(locale, { style: "unit", unit: "second", unitDisplay: "long" }).format(order.interval);
  const over = `${order.executionCount.toLocaleString(locale)} ${t("Swap:dca.orders")}`;

  return (
    <DcaOrderItemCardWrapper className={cx({ active: order.isActive })}>
      <div className="card-header">
        <OrderPairLabel
          inputToken={inputToken}
          outputToken={outputToken}
          inputAmount={formatOrderAmount(order.depositAmount)}
          linkUrl={txUrl}
        />
        {order.isActive ? (
          <ActiveDcaOrderStatus order={order} />
        ) : (
          <div className="card-status-group">
            <span className="card-status">{t(STATUS_LABEL_KEY[order.status])}</span>
            {/* The close time the order-api reports: unknown stays `-` instead of borrowing another time. */}
            <span className="card-status-time">{formatOrderDateTime(order.closedAt)}</span>
          </div>
        )}
      </div>
      <OrderProgressBar progress={order.progress} overview={overview} />
      <OrderMetrics metrics={metrics} />
      <div className="card-order-terms">
        <div className="card-sub-info">
          <span>{t("Swap:dca.every")}</span>
          <span className="value">{every}</span>
        </div>
        <div className="card-sub-info">
          <span>{t("Swap:dca.over")}</span>
          <span className="value">{over}</span>
        </div>
      </div>
      {order.isActive && (
        <OrderStopButton
          text={t("Swap:order.stopOrder")}
          onClick={() => onClickStop(order)}
        />
      )}
      {/* Completion does not pay out: the output stays claimable until the owner (or a keeper) claims it. */}
      {order.canClaim && (
        <OrderStopButton
          text={t("Swap:order.claimOrder")}
          onClick={() => onClickClaim(order)}
        />
      )}
      <OrderHistoryToggle visible={order.executedCount > 0} renderHistory={() => renderHistory(order)} />
    </DcaOrderItemCardWrapper>
  );
};

export default DcaOrderItemCard;
