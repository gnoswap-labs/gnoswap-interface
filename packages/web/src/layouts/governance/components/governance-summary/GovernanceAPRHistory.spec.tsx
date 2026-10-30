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
const weekEndingOctober30 = [
  day("2026-10-30", "10.00", "4.00", "6.00"),
  day("2026-10-29", "11.00", "4.40", "6.60"),
  day("2026-10-28", "12.00", "4.80", "7.20"),
  day("2026-10-27", "13.00", "5.20", "7.80"),
  day("2026-10-26", "14.00", "5.60", "8.40"),
  day("2026-10-25", "15.00", "6.00", "9.00"),
  day("2026-10-24", "16.00", "6.40", "9.60"),
];

const weekEndingOctober27 = [
  day("2026-10-27", "20.00", "8.00", "12.00"),
  day("2026-10-26", "21.00", "8.40", "12.60"),
  day("2026-10-25", "22.00", "8.80", "13.20"),
  day("2026-10-24", "23.00", "9.20", "13.80"),
  day("2026-10-23", "24.00", "9.60", "14.40"),
  day("2026-10-22", "25.00", "10.00", "15.00"),
  day("2026-10-21", "26.00", "10.40", "15.60"),
];


describe("GovernanceAPRHistory UTC window", () => {
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

  it("keeps seven consecutive API days when the local clock is ahead", () => {
    jest.setSystemTime(new Date("2026-10-31T12:00:00.000Z"));
    render(renderHistory(weekEndingOctober30));

    expect(getRenderedDates()).toEqual([
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
    ]);
    expect(getBodyRows().map(row => getCellTexts(row)[2])).toEqual([
      "10.00%",
      "11.00%",
      "12.00%",
      "13.00%",
      "14.00%",
      "15.00%",
      "16.00%",
    ]);
  });

  it("keeps seven consecutive API days when the local clock is behind", () => {
    jest.setSystemTime(new Date("2026-10-29T12:00:00.000Z"));
    render(renderHistory(weekEndingOctober30));

    expect(getRenderedDates()).toEqual([
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
    ]);
    expect(getBodyRows().map(row => getCellTexts(row)[2])).toEqual([
      "10.00%",
      "11.00%",
      "12.00%",
      "13.00%",
      "14.00%",
      "15.00%",
      "16.00%",
    ]);
  });

  it("anchors a lagged API response to its latest returned date", () => {
    jest.setSystemTime(new Date("2026-11-02T12:00:00.000Z"));
    render(renderHistory(weekEndingOctober27));

    expect(getRenderedDates()).toEqual([
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
      "2026-10-23",
      "2026-10-22",
      "2026-10-21",
    ]);
    expect(getBodyRows().map(row => getCellTexts(row)[2])).toEqual([
      "20.00%",
      "21.00%",
      "22.00%",
      "23.00%",
      "24.00%",
      "25.00%",
      "26.00%",
    ]);
  });


  it("shows gaps as unavailable, ignores older rows outside the window, and never averages neighbours", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(
      renderHistory([
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
    expect(screen.queryByText(/88\.88%/)).toBeNull();
    expect(screen.queryByText(/15\.00%|25\.00%/)).toBeNull();
  });


  it("uses seven UTC clock dates when there are no API rows", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(renderHistory([]));

    expect(getRenderedDates()).toEqual([
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
    ]);

    const rows = getBodyRows();
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      expect(getCellTexts(row)).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    }
  });

  it("ignores malformed API dates and falls back to seven UTC clock dates", () => {
    jest.setSystemTime(new Date("2026-10-30T12:00:00.000Z"));
    render(
      renderHistory([
        day("not-a-date", "99.99", "99.99", "99.99"),
        day("2026-02-30", "88.88", "88.88", "88.88"),
      ]),
    );

    expect(getRenderedDates()).toEqual([
      "2026-10-30",
      "2026-10-29",
      "2026-10-28",
      "2026-10-27",
      "2026-10-26",
      "2026-10-25",
      "2026-10-24",
    ]);
    for (const row of getBodyRows()) {
      expect(getCellTexts(row)).toEqual([UNAVAILABLE_CELL, UNAVAILABLE_CELL, UNAVAILABLE_CELL]);
    }
    expect(screen.queryByText(/99\.99%|88\.88%/)).toBeNull();
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
