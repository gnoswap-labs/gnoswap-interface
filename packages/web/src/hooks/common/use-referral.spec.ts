import {
  resolveReferralAddressForTransaction,
  resolveStoredReferralTransactionIntent,
  StoredReferrerInfo,
} from "@utils/referral-utils";

const ACCOUNT_ADDRESS = "g17rm3n8nqntd4c7kg9ghx6ul4xh4lm6njq0d3jn";
const REGISTERED_REFERRER = "g1cnz5gm2l09pm2k6rknjjar9a2w53fdhk4yjzy5";
const NEW_REFERRER = "g126swhfaq2vyvvjywevhgw7lv9hg8qan93dasu8";
const REFERRAL_PACKAGE_ADDRESS = "g1zgzdkj0y8l5l5s4r5s5s4q7d9y6ftxq0q0wxyz";

const makeStoredReferrerInfo = (overrides: Partial<StoredReferrerInfo>): StoredReferrerInfo => ({
  referrerAddress: "",
  updatedAt: Date.now(),
  ...overrides,
});

describe("useReferral helpers", () => {
  describe("resolveStoredReferralTransactionIntent", () => {
    test("returns reset for legacy empty stored value when api already has referrer", () => {
      const storedReferrerInfo = makeStoredReferrerInfo({ referrerAddress: "" });

      expect(
        resolveStoredReferralTransactionIntent(storedReferrerInfo, REGISTERED_REFERRER, ACCOUNT_ADDRESS),
      ).toBe("reset");
    });

    test("returns keep for legacy empty stored value when api has no registered referrer", () => {
      const storedReferrerInfo = makeStoredReferrerInfo({ referrerAddress: "" });

      expect(resolveStoredReferralTransactionIntent(storedReferrerInfo, "", ACCOUNT_ADDRESS)).toBe("keep");
    });

    test("returns stored explicit intent when present", () => {
      const storedReferrerInfo = makeStoredReferrerInfo({
        referrerAddress: "",
        transactionIntent: "reset",
      });

      expect(
        resolveStoredReferralTransactionIntent(storedReferrerInfo, REGISTERED_REFERRER, ACCOUNT_ADDRESS),
      ).toBe("reset");
    });
  });

  describe("resolveReferralAddressForTransaction", () => {
    test("returns url referrer when valid referral query is present", () => {
      expect(
        resolveReferralAddressForTransaction({
          urlReferralAddress: NEW_REFERRER,
          storedReferrerInfo: null,
          apiReferrerAddress: REGISTERED_REFERRER,
          accountAddress: ACCOUNT_ADDRESS,
          packageReferralAddress: REFERRAL_PACKAGE_ADDRESS,
        }),
      ).toBe(NEW_REFERRER);
    });

    test("returns referral package address for reset intent", () => {
      expect(
        resolveReferralAddressForTransaction({
          urlReferralAddress: null,
          storedReferrerInfo: makeStoredReferrerInfo({
            referrerAddress: "",
            transactionIntent: "reset",
          }),
          apiReferrerAddress: REGISTERED_REFERRER,
          accountAddress: ACCOUNT_ADDRESS,
          packageReferralAddress: REFERRAL_PACKAGE_ADDRESS,
        }),
      ).toBe(REFERRAL_PACKAGE_ADDRESS);
    });

    test("returns user address for set intent", () => {
      expect(
        resolveReferralAddressForTransaction({
          urlReferralAddress: null,
          storedReferrerInfo: makeStoredReferrerInfo({
            referrerAddress: NEW_REFERRER,
            transactionIntent: "set",
          }),
          apiReferrerAddress: REGISTERED_REFERRER,
          accountAddress: ACCOUNT_ADDRESS,
          packageReferralAddress: REFERRAL_PACKAGE_ADDRESS,
        }),
      ).toBe(NEW_REFERRER);
    });

    test("returns empty string when there is nothing to change", () => {
      expect(
        resolveReferralAddressForTransaction({
          urlReferralAddress: null,
          storedReferrerInfo: null,
          apiReferrerAddress: REGISTERED_REFERRER,
          accountAddress: ACCOUNT_ADDRESS,
          packageReferralAddress: REFERRAL_PACKAGE_ADDRESS,
        }),
      ).toBe("");
    });
  });
});
