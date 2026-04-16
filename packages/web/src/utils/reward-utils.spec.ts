import { mapToDisplayRewardType, isInternalRewardType } from "./reward-utils";

describe("reward-utils", () => {
  describe("mapToDisplayRewardType", () => {
    it("maps INTERNAL_REWARD to the internal reward display bucket", () => {
      expect(mapToDisplayRewardType("INTERNAL_REWARD")).toBe("INTERNAL_REWARD");
    });

    it("keeps legacy internal tiers in the internal reward display bucket", () => {
      expect(mapToDisplayRewardType("INTERNAL_TIER_1")).toBe("INTERNAL_REWARD");
      expect(mapToDisplayRewardType("INTERNAL_TIER_2")).toBe("INTERNAL_REWARD");
      expect(mapToDisplayRewardType("INTERNAL_TIER_3")).toBe("INTERNAL_REWARD");
    });
  });

  describe("isInternalRewardType", () => {
    it("treats INTERNAL_REWARD as an internal reward", () => {
      expect(isInternalRewardType("INTERNAL_REWARD")).toBe(true);
    });

    it("still recognizes legacy internal reward tiers", () => {
      expect(isInternalRewardType("INTERNAL_TIER_1")).toBe(true);
      expect(isInternalRewardType("INTERNAL_TIER_2")).toBe(true);
      expect(isInternalRewardType("INTERNAL_TIER_3")).toBe(true);
    });

    it("does not classify external rewards or swap fees as internal rewards", () => {
      expect(isInternalRewardType("EXTERNAL_REWARD")).toBe(false);
      expect(isInternalRewardType("SWAP_FEE")).toBe(false);
    });
  });
});
