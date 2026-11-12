import { cx } from "@emotion/css";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatDisplayTime, getTimeDiffInSeconds } from "@common/utils/date-util";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Pagination from "@components/common/pagination/Pagination";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { OrderHistoryModel } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import { formatOrderAmount, formatOrderFee } from "@utils/order-format-utils";

import { OrderHistoryTableWrapper } from "./OrderHistoryTable.styles";

const HIGHLIGHT_DURATION = 1_000;
const CLOCK_INTERVAL = 1_000;

export interface OrderHistoryTableProps {
  items: OrderHistoryModel[];
  inputToken: TokenModel;
  outputToken: TokenModel;
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
  isPreviousData?: boolean;
  compact?: boolean;
  /** Limit fills only: shows each fill's actual execution fee in its own column. */
  showExecutionFee?: boolean;
}

/** `1s ago` at the earliest and `>1y ago` at the latest, one unit only. */
export function formatHistoryTime(time: number, now: number): string {
  return formatDisplayTime(getTimeDiffInSeconds(now, time * 1000), { capAtYear: true, minOneSecond: true });
}

/** Executions (DCA) or fills (limit) of an order, ten per page. Rows added while open are highlighted. */
const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  items,
  inputToken,
  outputToken,
  currentPage,
  totalPages,
  changePage,
  isPreviousData = false,
  compact = false,
  showExecutionFee = false,
}) => {
  const { t } = useTranslation(["Swap", "AddPosition"]);
  const { getTxUrl } = useGnoscanUrl();
  const [now, setNow] = useState(() => Date.now());
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const previousSnapshot = useRef<{ page: number; keys: Set<string> } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPreviousData) {
      setHighlighted(new Set());
      return;
    }
    const keys = new Set(items.map(item => item.key));
    const previous = previousSnapshot.current;
    previousSnapshot.current = { page: currentPage, keys };
    // Only a refresh of the same first page can contain newly arrived rows.
    if (!previous || previous.page !== currentPage || currentPage !== 1) {
      setHighlighted(new Set());
      return;
    }

    const added = items.filter(item => !previous.keys.has(item.key)).map(item => item.key);
    setHighlighted(new Set(added));
    if (added.length === 0) return;
    const timer = setTimeout(() => setHighlighted(new Set()), HIGHLIGHT_DURATION);
    return () => clearTimeout(timer);
  }, [currentPage, isPreviousData, items]);

  return (
    <OrderHistoryTableWrapper className={cx({ "with-fee": showExecutionFee })}>
      <div className="history-row history-header">
        <span className="cell left">{t("Swap:order.time")}</span>
        <span className="cell">{t("Swap:order.rate")}</span>
        <span className="cell">{t("Swap:order.sold")}</span>
        <span className="cell">{t("Swap:order.purchased")}</span>
        {showExecutionFee && <span className="cell">{t("AddPosition:fee")}</span>}
      </div>
      {items.map(item => (
        <div key={item.key} className={cx("history-row", { highlight: highlighted.has(item.key) })}>
          <span className="cell left">
            <DateTimeTooltip date={new Date(item.time * 1000)}>
              <span>{formatHistoryTime(item.time, now)}</span>
            </DateTimeTooltip>
            <Link className="time-link" href={getTxUrl(item.txHash)} target="_blank" aria-label="Transaction link">
              <IconOpenLink size="10px" className="path-link-icon" />
            </Link>
          </span>
          <span className="cell">
            <span>{item.rate === null ? "-" : formatOrderAmount(item.rate)}</span>
          </span>
          <span className="cell">
            <span>{formatOrderAmount(item.soldAmount)}</span>
            <MissingLogo symbol={inputToken.symbol} url={inputToken.logoURI} width={compact ? 12 : 14} />
          </span>
          <span className="cell">
            <span>{formatOrderAmount(item.purchasedAmount)}</span>
            <MissingLogo symbol={outputToken.symbol} url={outputToken.logoURI} width={compact ? 12 : 14} />
          </span>
          {showExecutionFee && (
            <span className="cell fee-cell">
              <span className="fee-amount">{formatOrderFee(item.executionFee, outputToken.decimals)}</span>
              {item.executionFee !== null && item.executionFee !== undefined && (
                <MissingLogo symbol={outputToken.symbol} url={outputToken.logoURI} width={compact ? 12 : 14} />
              )}
            </span>
          )}
        </div>
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={changePage}
            siblingCount={compact ? 0 : 1}
            compact={compact}
          />
        </div>
      )}
    </OrderHistoryTableWrapper>
  );
};

export default OrderHistoryTable;
