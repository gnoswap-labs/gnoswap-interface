import {
  isLaunchpadParticipationClaimable,
  isLaunchpadParticipationClaimed,
} from "./launchpad-claimable-participation";

const PAST_TIME = "2020-01-01T00:00:00Z";

describe("isLaunchpadParticipationClaimed", () => {
  it("returns false when deposit is not withdrawn", () => {
    expect(isLaunchpadParticipationClaimed({ claimableRewardAmount: 0, depositAmount: 1000 })).toBe(false);
    expect(isLaunchpadParticipationClaimed({ claimableRewardAmount: 0, depositAmount: 1000, withdrawn: false })).toBe(
      false,
    );
  });

  it("returns true when deposit is withdrawn and no reward remains", () => {
    expect(isLaunchpadParticipationClaimed({ claimableRewardAmount: 0, depositAmount: 1000, withdrawn: true })).toBe(
      true,
    );
  });

  it("returns false when deposit is withdrawn but reward remains", () => {
    expect(isLaunchpadParticipationClaimed({ claimableRewardAmount: 10, depositAmount: 1000, withdrawn: true })).toBe(
      false,
    );
  });
});

describe("isLaunchpadParticipationClaimable", () => {
  it("returns true when deposit is not withdrawn", () => {
    expect(
      isLaunchpadParticipationClaimable({ claimableTime: PAST_TIME, claimableRewardAmount: 0, depositAmount: 1000 }),
    ).toBe(true);
  });

  it("returns false when deposit is withdrawn and no reward remains", () => {
    expect(
      isLaunchpadParticipationClaimable({
        claimableTime: PAST_TIME,
        claimableRewardAmount: 0,
        depositAmount: 1000,
        withdrawn: true,
      }),
    ).toBe(false);
  });
});
