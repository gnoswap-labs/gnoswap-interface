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
import { formatOrderAmount, formatOrderRoi } from "@utils/order-format-utils";

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
  compact?: boolean;
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
  compact = false,
}) => {
  const { t } = useTranslation();
  const { getTxUrl } = useGnoscanUrl();
  const [now, setNow] = useState(() => Date.now());
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const previousKeys = useRef<Set<string> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const keys = new Set(items.map(item => item.key));
    const previous = previousKeys.current;
    previousKeys.current = keys;
    // Nothing is new on the first render or on another page.
    if (!previous || currentPage !== 1) return;

    const added = items.filter(item => !previous.has(item.key)).map(item => item.key);
    if (added.length === 0) return;
    setHighlighted(new Set(added));
    const timer = setTimeout(() => setHighlighted(new Set()), HIGHLIGHT_DURATION);
    return () => clearTimeout(timer);
  }, [currentPage, items]);

  return (
    <OrderHistoryTableWrapper>
      <div className="history-row history-header">
        <span className="cell left">{t("Swap:order.time")}</span>
        <span className="cell">{t("Swap:order.rate")}</span>
        <span className="cell">{t("Swap:order.sold")}</span>
        <span className="cell">{t("Swap:order.purchased")}</span>
      </div>
      {items.map(item => {
        const roundReturn = formatOrderRoi(item.returnRate ?? null);
        return (
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
              {roundReturn && (
                <span className={cx("return", { negative: roundReturn.isNegative })}>{roundReturn.text}</span>
              )}
            </span>
          </div>
        );
      })}
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
