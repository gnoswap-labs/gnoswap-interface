import { getMaximumIncentiveStartDate, getMinimumIncentiveStartDate, isIncentiveStartDateValid } from "./earn";

describe("external incentive start date policy", () => {
  it("uses the first UTC midnight at least 24 hours after creation", () => {
    const now = Date.UTC(2026, 8, 1, 12, 0, 0);

    expect(getMinimumIncentiveStartDate(now)).toEqual({
      year: 2026,
      month: 9,
      date: 3,
    });
  });

  it("allows start dates through seven days after the first eligible UTC midnight", () => {
    const now = Date.UTC(2026, 8, 1, 12, 0, 0);

    expect(getMaximumIncentiveStartDate(now)).toEqual({
      year: 2026,
      month: 9,
      date: 10,
    });
  });

  it("rejects start dates outside the contract range", () => {
    const now = Date.UTC(2026, 8, 1, 12, 0, 0);

    expect(isIncentiveStartDateValid({ year: 2026, month: 9, date: 3 }, now)).toBe(true);
    expect(isIncentiveStartDateValid({ year: 2026, month: 9, date: 10 }, now)).toBe(true);
    expect(isIncentiveStartDateValid({ year: 2026, month: 9, date: 2 }, now)).toBe(false);
    expect(isIncentiveStartDateValid({ year: 2026, month: 9, date: 11 }, now)).toBe(false);
  });
});
