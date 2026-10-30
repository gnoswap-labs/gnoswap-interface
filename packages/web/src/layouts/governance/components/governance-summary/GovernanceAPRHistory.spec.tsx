/// <reference types="jest" />

import React from "react";
import { render, screen, within } from "@testing-library/react";

import type { GovernanceAPRHistory as APRHistoryDay } from "@repositories/governance";
import { UNAVAILABLE_APR } from "@layouts/governance/xgns-apr/xgns-apr";

import GovernanceAPRHistory from "./GovernanceAPRHistory";

jest.mock("./GovernanceAPRHistory.styles", () => ({
  __esModule: true,
  GovernanceAPRHistoryContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const UNAVAILABLE_CELL = `${UNAVAILABLE_APR}Not available`;

const renderHistory = (days: APRHistoryDay[]) => (
  <GovernanceAPRHistory
    days={days}
    dateLabel="Date"
    dailyAprLabel="Total"
    feeLabel="Fees"
    emissionLabel="Emission"
    unavailableLabel="Not available"
    locale="en-US"
  />
);

const getBodyRows = () => screen.getAllByRole("row").slice(1);

const getRenderedDates = () =>
  getBodyRows().map(row => within(row).getByRole("rowheader").querySelector("time")?.getAttribute("datetime"));

/** Cell text in column order: fees, emission, total. */
const getCellTexts = (row: HTMLElement) =>
  within(row)
    .getAllByRole("cell")
    .map(cell => cell.textContent);

const day = (date: string, apr: string, protocolFeeApr: string, emissionApr: string): APRHistoryDay => ({
  date,
  apr,
  protocolFeeApr,
  emissionApr,
  estimated: false,
});

describe("GovernanceAPRHistory fixed UTC window", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("lists today and the previous six UTC dates, latest first, rolling over exactly at UTC midnight", () => {
    jest.setSystemTime(new Date("2026-10-30T23:59:59.999Z"));
    const { rerender } = render(renderHistory([]));

    expect(getRenderedDates()).toEqual([
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
    ]);

    jest.setSystemTime(new Date("2026-10-31T00:00:00.000Z"));
    rerender(renderHistory([]));

    expect(getRenderedDates()).toEqual([
      "2026-10-31",
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
    ]);
  });

  it("walks back across month and year boundaries on UTC dates", () => {
    jest.setSystemTime(new Date("2027-01-03T00:00:00.000Z"));
    render(renderHistory([]));

    expect(getRenderedDates()).toEqual([
      "2027-01-03",
      "2027-01-02",
      "2027-01-01",
      "2026-12-31",
      "2026-12-30",
      "2026-12-29",
      "2026-12-28",
    ]);
  });

  it("shows gaps as unavailable, ignores rows outside the window, and never averages neighbours", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(
      renderHistory([
        day("2026-10-31", "99.99", "99.99", "99.99"),
        day("2026-10-30", "10.00", "4.00", "6.00"),
        day("2026-10-28", "20.00", "8.00", "12.00"),
        day("2026-10-24", "30.00", "10.00", "20.00"),
        day("2026-10-23", "88.88", "88.88", "88.88"),
      ]),
    );

    const rows = getBodyRows();
    expect(rows).toHaveLength(7);
    expect(getCellTexts(rows[0])).toEqual(["4.00%", "6.00%", "10.00%"]);
    expect(getCellTexts(rows[1])).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    expect(getCellTexts(rows[2])).toEqual(["8.00%", "12.00%", "20.00%"]);
    for (const index of [3, 4, 5]) {
      expect(getCellTexts(rows[index])).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    }
    expect(getCellTexts(rows[6])).toEqual(["10.00%", "20.00%", "30.00%"]);
    expect(screen.queryByText(/99\.99%|88\.88%/)).toBeNull();
    expect(screen.queryByText(/15\.00%|25\.00%/)).toBeNull();
  });

  it("still renders seven unavailable rows when no date in the window has data", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(renderHistory([day("2026-10-01", "12.34", "4.56", "7.78")]));

    const rows = getBodyRows();
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      expect(getCellTexts(row)).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    }
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("keeps an actual zero as 0.00% while a missing neighbour stays unavailable", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(renderHistory([day("2026-10-30", "0", "0", "0"), day("2026-10-28", "0", "0", "0")]));

    const rows = getBodyRows();
    expect(getCellTexts(rows[0])).toEqual(["0.00%", "0.00%", "0.00%"]);
    expect(getCellTexts(rows[1])).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    expect(getCellTexts(rows[2])).toEqual(["0.00%", "0.00%", "0.00%"]);
  });

  it("keeps a returned row's blank components unavailable instead of deriving them from its total", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(renderHistory([{ date: "2026-10-30", apr: "12.34", estimated: false }]));

    expect(getCellTexts(getBodyRows()[0])).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, "12.34%"]);
  });
});
