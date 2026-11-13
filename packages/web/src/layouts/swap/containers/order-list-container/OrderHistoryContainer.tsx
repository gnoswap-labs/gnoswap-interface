import React, { useState } from "react";

import { useWindowSize } from "@hooks/common/use-window-size";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { LimitOrderModel } from "@models/order/limit-order-model";
import { useGetDcaExecutions, useGetLimitOrderFills } from "@query/order";

import OrderHistoryTable from "../../components/order-list/order-history-table/OrderHistoryTable";

const HISTORY_PAGE_SIZE = 10;

/** Executions of a DCA order. Mounted only while its history is open, so it only polls then. */
export const DcaOrderHistoryContainer: React.FC<{ order: DcaOrderModel }> = ({ order }) => {
  const { isMobile } = useWindowSize();
  const [page, setPage] = useState(1);
  const { data, isPreviousData } = useGetDcaExecutions({
    orderId: order.orderId,
    packagePath: order.packagePath,
    page,
    size: HISTORY_PAGE_SIZE,
    inputToken: order.inputToken,
    outputToken: order.outputToken,
  });

  if (!data || data.items.length === 0) return null;

  return (
    <OrderHistoryTable
      items={data.items}
      inputToken={order.inputToken}
      outputToken={order.outputToken}
      currentPage={page}
      totalPages={data.pageInfo.totalPages}
      changePage={setPage}
      isPreviousData={isPreviousData}
      compact={isMobile}
    />
  );
};

/** Fills of a limit order. Mounted only while its history is open. */
export const LimitOrderHistoryContainer: React.FC<{ order: LimitOrderModel }> = ({ order }) => {
  const { isMobile } = useWindowSize();
  const [page, setPage] = useState(1);
  const { data, isPreviousData } = useGetLimitOrderFills({
    orderId: order.orderId,
    packagePath: order.packagePath,
    page,
    size: HISTORY_PAGE_SIZE,
    tokenIn: order.tokenIn,
    tokenOut: order.tokenOut,
  });

  if (!data || data.items.length === 0) return null;

  return (
    <OrderHistoryTable
      items={data.items}
      inputToken={order.tokenIn}
      outputToken={order.tokenOut}
      rateBase={order.side ? (order.side === "buy" ? "output" : "input") : undefined}
      currentPage={page}
      totalPages={data.pageInfo.totalPages}
      changePage={setPage}
      isPreviousData={isPreviousData}
      compact={isMobile}
    />
  );
};
