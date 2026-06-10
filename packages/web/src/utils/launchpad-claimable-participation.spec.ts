import { isLaunchpadParticipationClaimable } from "./launchpad-claimable-participation";

describe("isLaunchpadParticipationClaimable", () => {
  const now = new Date("2026-06-10T00:00:00.000Z").getTime();
  const claimableTime = "2026-06-09T00:00:00.000Z";

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns false when backend marks participation withdrawn", () => {
    const participation = {
      claimableTime,
      claimableRewardAmount: 100,
      depositAmount: 100,
      withdrawn: true,
    };

    expect(isLaunchpadParticipationClaimable(participation)).toBe(false);
  });

  it("uses amount and time rules when participation is not withdrawn", () => {
    expect(
      isLaunchpadParticipationClaimable({
        claimableTime,
        claimableRewardAmount: 100,
        depositAmount: 100,
        withdrawn: false,
      }),
    ).toBe(true);
  });
});
