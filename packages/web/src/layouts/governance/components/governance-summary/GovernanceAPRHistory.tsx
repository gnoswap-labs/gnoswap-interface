import React from "react";

import type { GovernanceAPRHistory as APRHistoryDay } from "@repositories/governance";
import { formatXgnsApr } from "@layouts/governance/xgns-apr/xgns-apr";

import { GovernanceAPRHistoryContent } from "./GovernanceAPRHistory.styles";
import GovernanceAPRValue from "./GovernanceAPRValue";

interface GovernanceAPRHistoryProps {
  /** Daily total APR with protocol-fee and emission components. */
  days: APRHistoryDay[];
  dateLabel: string;
  dailyAprLabel: string;
  feeLabel: string;
  emissionLabel: string;
  unavailableLabel: string;
  locale: string;
}

const HISTORY_DAY_COUNT = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Today (UTC) followed by the previous six UTC dates, latest first, as YYYY-MM-DD. */
const getHistoryDates = (now: number): string[] => {
  const today = new Date(now);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  return Array.from({ length: HISTORY_DAY_COUNT }, (_, index) =>
    new Date(todayUtc - index * MS_PER_DAY).toISOString().slice(0, 10),
  );
};

/**
 * Always lists the fixed UTC window. Dates the API did not return stay blank so they render as
 * unavailable; nothing is averaged or zero-filled here.
 */
const toHistoryRows = (days: APRHistoryDay[], now: number): APRHistoryDay[] => {
  const byDate = new Map<string, APRHistoryDay>();
  for (const day of days) {
    if (!byDate.has(day.date)) byDate.set(day.date, day);
  }

  return getHistoryDates(now).map(date => byDate.get(date) ?? { date, apr: "", estimated: false });
};

const GovernanceAPRHistory: React.FC<GovernanceAPRHistoryProps> = ({
  days,
  dateLabel,
  dailyAprLabel,
  feeLabel,
  emissionLabel,
  unavailableLabel,
  locale,
}) => {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return (
    <GovernanceAPRHistoryContent>
      <table>
        <thead>
          <tr>
            <th scope="col">{dateLabel}</th>
            <th scope="col">{feeLabel}</th>
            <th scope="col">{emissionLabel}</th>
            <th scope="col">{dailyAprLabel}</th>
          </tr>
        </thead>
        <tbody>
          {toHistoryRows(days, Date.now()).map(({ date, apr, protocolFeeApr, emissionApr, estimated, asOf }) => {
            const day = new Date(`${date}T00:00:00Z`);

            return (
              <tr key={date}>
                <th scope="row">
                  <time dateTime={date}>
                    {date.slice(5).replace("-", "/")} ({weekday.format(day)})
                  </time>
                  {estimated && <span className="estimate">≈{asOf && ` ${time.format(new Date(asOf))} UTC`}</span>}
                </th>
                <td>
                  <GovernanceAPRValue value={formatXgnsApr(protocolFeeApr)} unavailableLabel={unavailableLabel} />
                </td>
                <td>
                  <GovernanceAPRValue value={formatXgnsApr(emissionApr)} unavailableLabel={unavailableLabel} />
                </td>
                <td>
                  <GovernanceAPRValue value={formatXgnsApr(apr)} unavailableLabel={unavailableLabel} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GovernanceAPRHistoryContent>
  );
};

export default GovernanceAPRHistory;
