import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import { ValueAnnotation } from "@components/order/common/OrderValueAnnotation.styles";
import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { DcaOrderModel, getDcaIntervalUnit } from "@models/order/dca-order-model";
import {
  calculateDcaOrderEndAt,
  calculatePriceDeviation,
  formatBps,
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderFee,
  formatOrderFeeUsd,
  formatOrderFullAmount,
  formatOrderPriceDeviation,
  formatOrderRate,
  formatOrderRemainingTime,
  formatOrderTimeUntil,
} from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { DcaOrderItemCardWrapper } from "./DcaOrderItemCard.styles";
import { OrderHistoryToggle, OrderMetric, OrderMetrics, OrderStopButton } from "./OrderItemCardParts";

export interface DcaOrderItemCardProps {
  order: DcaOrderModel;
  /** Current output per input of the pool the order trades on. Null while unknown. */
  marketPrice: string | null;
  /** Current USD price of the order's output token, to value the execution fee. Null while unknown. */
  outputTokenUsdPrice?: string | null;
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

/** A rate with the output symbol; the full value has every digit and the input it is quoted for. */
function formatPriceMetric(rate: string | null, order: DcaOrderModel, full = false): string {
  if (rate === null) return "-";
  const { inputToken, outputToken } = order;
  if (!full) return `${formatOrderRate(rate)} ${outputToken.displaySymbol}`;

  const value = BigNumber(rate);
  return `1 ${inputToken.displaySymbol} = ${formatOrderFullAmount(value, value.decimalPlaces() ?? 0)} ${
    outputToken.displaySymbol
  }`;
}

const DcaOrderItemCard: React.FC<DcaOrderItemCardProps> = ({
  order,
  marketPrice,
  outputTokenUsdPrice = null,
  txUrl,
  onClickStop,
  onClickClaim,
  renderHistory,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const { inputToken, outputToken } = order;

  const metrics: OrderMetric[] = useMemo(() => {
    const deviation = formatOrderPriceDeviation(calculatePriceDeviation(order.priceRate, marketPrice), locale);
    const purchased = `${formatOrderFullAmount(order.purchasedAmount, outputToken.decimals)} ${
      outputToken.displaySymbol
    }`;
    const filled = `(${t("Swap:order.filledShare", { percent: formatOrderAmount(order.progress) })})`;
    return [
      {
        key: "marketPrice",
        label: t("Swap:order.marketPrice"),
        value: formatPriceMetric(marketPrice, order),
        fullValue: formatPriceMetric(marketPrice, order, true),
      },
      {
        key: "executedPrice",
        label: t("Swap:order.executedPriceAvg"),
        value: formatPriceMetric(order.priceRate, order),
        fullValue: formatPriceMetric(order.priceRate, order, true),
        annotation: deviation ? `(${deviation})` : undefined,
      },
      { key: "purchased", label: t("Swap:order.purchasedAmount"), value: purchased, annotation: filled },
    ];
  }, [locale, marketPrice, order, outputToken.decimals, outputToken.displaySymbol, t]);

  const overview = useMemo(() => {
    const inputAmount = (amount: string) =>
      `${formatOrderFullAmount(amount, inputToken.decimals)} ${inputToken.displaySymbol}`;
    const sold = formatOrderFullAmount(order.soldAmount, inputToken.decimals);
    // A refund empties escrow, but does not change how much of the original deposit went unfilled.
    const unfilled = BigNumber(order.depositAmount).minus(order.soldAmount).toFixed();
    const rows = [
      {
        label: t("Swap:order.soldAmount"),
        value: `${sold} / ${inputAmount(order.depositAmount)} (${formatOrderAmount(order.progress)}%)`,
      },
      { label: t("Swap:order.remainingAmount"), value: inputAmount(unfilled) },
      {
        label: t("Swap:order.purchasedAmount"),
        value: `${formatOrderFullAmount(order.purchasedAmount, outputToken.decimals)} ${outputToken.displaySymbol}`,
      },
    ];
    if (!order.isActive) {
      rows.push({
        label: t(order.status === "CANCELLED" ? "Swap:order.cancelledAt" : "Swap:order.completedAt"),
        value: formatOrderDateTime(order.closedAt),
      });
    }
    return rows;
  }, [inputToken, order, outputToken, t]);

  // The terms the order was placed with, not what is left of them. An interval that is none of the allowed units
  // is told in plain seconds.
  const intervalUnit = getDcaIntervalUnit(order.interval);
  const every = intervalUnit
    ? t(`Swap:dca.intervalPhrase.${intervalUnit}`)
    : new Intl.NumberFormat(locale, { style: "unit", unit: "second", unitDisplay: "long" }).format(order.interval);
  const orderCount = (count: number) => `${count.toLocaleString(locale)} ${t("Swap:dca.orders")}`;
  const nextOrderIn = order.isActive ? formatOrderRemainingTime(order.nextExecutionAt, locale, nowUnixSeconds) : null;
  const expiresAt = order.isActive ? calculateDcaOrderEndAt(order) : null;
  const expiresIn = formatOrderTimeUntil(expiresAt, locale, nowUnixSeconds);
  const executionFeeUsd = formatOrderFeeUsd(order.executionFeeAmount, outputTokenUsdPrice);
  const executionFeeLabel =
    order.executionFeeRate === null
      ? t("Swap:dca.executionFee")
      : `${t("Swap:dca.executionFee")} (${formatBps(order.executionFeeRate)})`;

  return (
    <DcaOrderItemCardWrapper className={cx({ active: order.isActive })}>
      <div className="card-header">
        <OrderPairLabel
          inputToken={inputToken}
          outputToken={outputToken}
          inputAmount={formatOrderFullAmount(order.depositAmount, inputToken.decimals)}
          showOutputLogo
          linkUrl={txUrl}
        />
        {order.isActive ? (
          <ActiveDcaOrderStatus order={order} />
        ) : (
          <div className="card-status-group">
            <span className="card-status">
              {/* A keeper closed it because it blocked its group; refunded and claimed as a normal cancel. */}
              {t(order.forceCancelled ? "Swap:order.status.cancelledByKeeper" : STATUS_LABEL_KEY[order.status])}
            </span>
            {/* The close time the order-api reports: unknown stays `-` instead of borrowing another time. */}
            <span className="card-status-time">{formatOrderDateTime(order.closedAt)}</span>
          </div>
        )}
      </div>
      <OrderProgressBar progress={order.progress} overview={overview} />
      <OrderMetrics metrics={metrics} truncateFractions />
      <div className="card-order-terms">
        <div className="card-sub-info">
          <span>{t("Swap:dca.every")}</span>
          <span className="value">{every}</span>
        </div>
        <div className="card-sub-info">
          <span>{t("Swap:order.order")}</span>
          <span className="value">{orderCount(order.executionCount)}</span>
        </div>
        {order.isActive && (
          <div className="card-sub-info">
            <span>{t("Swap:order.nextOrder")}</span>
            <span className="value">{nextOrderIn ?? "-"}</span>
          </div>
        )}
        <div className="card-sub-info">
          <span>{t("Swap:order.remainingOrders")}</span>
          <span className="value">{orderCount(order.remainingCount)}</span>
        </div>
        <div className="card-sub-info">
          <span>{executionFeeLabel}</span>
          <span className="value">
            {formatOrderFee(order.executionFeeAmount, outputToken.decimals)}
            {order.executionFeeAmount !== null && ` ${outputToken.displaySymbol}`}
            {executionFeeUsd && <span className="value-usd">{` (${executionFeeUsd})`}</span>}
          </span>
        </div>
        {order.isActive && (
          <div className="card-sub-info">
            <span>{t("Swap:order.expiresAt")}</span>
            <span className="value">
              {formatOrderDateTime(expiresAt)} {expiresIn && <ValueAnnotation>({expiresIn})</ValueAnnotation>}
            </span>
          </div>
        )}
      </div>
      {order.isActive && <OrderStopButton text={t("Swap:order.stopOrder")} onClick={() => onClickStop(order)} />}
      {/* Completion does not pay out: the output stays claimable until the owner (or a keeper) claims it. */}
      {order.canClaim && <OrderStopButton text={t("Swap:order.claimOrder")} onClick={() => onClickClaim(order)} />}
      <OrderHistoryToggle visible={order.executedCount > 0} renderHistory={() => renderHistory(order)} />
    </DcaOrderItemCardWrapper>
  );
};

export default DcaOrderItemCard;
