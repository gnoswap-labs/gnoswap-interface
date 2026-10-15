import React from "react";
import BigNumber from "bignumber.js";

import type { GovernanceAPRHistory as APRHistoryDay } from "@repositories/governance";

import { GovernanceAPRHistoryContent } from "./GovernanceAPRHistory.styles";

interface GovernanceAPRHistoryProps {
  average: string;
  days: APRHistoryDay[];
  dateLabel: string;
  dailyAprLabel: string;
  comparisonLabel: string;
  locale: string;
}

const GovernanceAPRHistory: React.FC<GovernanceAPRHistoryProps> = ({
  average,
  days,
  dateLabel,
  dailyAprLabel,
  comparisonLabel,
  locale,
}) => {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  const displayedAverage = new BigNumber(average).decimalPlaces(2, BigNumber.ROUND_DOWN);

  return (
    <GovernanceAPRHistoryContent>
      <table>
        <thead>
          <tr>
            <th scope="col">{dateLabel}</th>
            <th scope="col">{dailyAprLabel}</th>
            <th scope="col">{comparisonLabel}</th>
          </tr>
        </thead>
        <tbody>
          {days.map(({ date, apr, estimated, asOf }) => {
            const day = new Date(`${date}T00:00:00Z`);
            const displayedAPR = new BigNumber(apr).decimalPlaces(2, BigNumber.ROUND_DOWN);
            const difference = displayedAPR.minus(displayedAverage);
            const prefix = difference.isGreaterThan(0) ? "+" : "";

            return (
              <tr key={date}>
                <td>
                  <time dateTime={date}>
                    {date.slice(5).replace("-", "/")} ({weekday.format(day)})
                  </time>
                  {estimated && <span className="estimate">≈{asOf && ` ${time.format(new Date(asOf))} UTC`}</span>}
                </td>
                <td>{displayedAPR.toFixed(2)}%</td>
                <td>
                  {prefix}
                  {difference.toFixed(2)}
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
