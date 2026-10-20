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

  it("anchors to startTime when the pool has not started", () => {
    expect(getClaimableTime(86_400, "2026-05-20T00:00:00.000Z", "2026-06-20T00:00:00.000Z")?.toISOString()).toBe(
      "2026-05-21T00:00:00.000Z",
    );
  });

  it("anchors to now when the pool has started", () => {
    expect(getClaimableTime(86_400, "2026-05-01T00:00:00.000Z", "2026-06-20T00:00:00.000Z")?.toISOString()).toBe(
      "2026-05-14T00:00:00.000Z",
    );
  });

  it("caps at endTime", () => {
    expect(getClaimableTime(86_400, "2026-05-01T00:00:00.000Z", "2026-05-13T12:00:00.000Z")?.toISOString()).toBe(
      "2026-05-13T12:00:00.000Z",
    );
  });

  it("returns undefined when threshold is missing", () => {
    expect(getClaimableTime()).toBeUndefined();
  });
});
