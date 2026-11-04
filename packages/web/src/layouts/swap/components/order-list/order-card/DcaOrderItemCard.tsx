import { cx } from "@emotion/css";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import OrderPairLabel from "@components/order/order-pair-label/OrderPairLabel";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { formatOrderAmount, formatOrderDate, formatOrderDateTime, formatOrderRate } from "@utils/order-format-utils";

import OrderProgressBar from "../order-progress-bar/OrderProgressBar";
import { OrderItemCardWrapper } from "./OrderItemCard.styles";
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

const DcaOrderItemCard: React.FC<DcaOrderItemCardProps> = ({
  order,
  roi,
  txUrl,
  onClickStop,
  onClickClaim,
  renderHistory,
}) => {
  const { t } = useTranslation();
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
      { key: "rate", label: t("Swap:order.priceRate"), value: formatOrderRate(order.priceRate) },
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

  return (
    <OrderItemCardWrapper className={cx({ active: order.isActive })}>
      <div className="card-header">
        <OrderPairLabel inputToken={inputToken} outputToken={outputToken} linkUrl={txUrl} />
        {order.isActive ? (
          <span className="card-status ongoing">{t("Swap:order.ongoing")}</span>
        ) : (
          <span className="card-status">{formatOrderDate(order.closedAt)}</span>
        )}
      </div>
      <OrderProgressBar progress={order.progress} overview={overview} />
      <OrderMetrics metrics={metrics} />
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
    </OrderItemCardWrapper>
  );
};

export default DcaOrderItemCard;
