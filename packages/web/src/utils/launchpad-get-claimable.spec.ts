import { getClaimableTime } from "./launchpad-get-claimable";

describe("getClaimableTime", () => {
  const now = new Date("2026-05-13T00:00:00.000Z").getTime();

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("treats claimableThreshold as seconds", () => {
    expect(getClaimableTime(86_400)?.toISOString()).toBe("2026-05-14T00:00:00.000Z");
  });

  it("returns undefined when threshold is missing", () => {
    expect(getClaimableTime()).toBeUndefined();
  });
});
