/* eslint-disable @typescript-eslint/no-require-imports */
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as JotaiProvider } from "jotai";

jest.mock("./use-custom-router", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  __esModule: true,
  useWallet: jest.fn(),
}));

jest.mock("@query/leaderboard", () => ({
  __esModule: true,
  useGetLeaderboardByAddress: jest.fn(),
}));

const { useReferral } = require("./use-referral") as typeof import("./use-referral");
const { default: useCustomRouter } = require("./use-custom-router") as typeof import("./use-custom-router");
const { useWallet } = require("@hooks/wallet/data/use-wallet") as typeof import("@hooks/wallet/data/use-wallet");
const { useGetLeaderboardByAddress } = require("@query/leaderboard") as typeof import("@query/leaderboard");

const ACCOUNT_ADDRESS = "g17rm3n8nqntd4c7kg9ghx6ul4xh4lm6njq0d3jn";
const NEW_REFERRER = "g126swhfaq2vyvvjywevhgw7lv9hg8qan93dasu8";

const mockedUseCustomRouter = jest.mocked(useCustomRouter);
const mockedUseWallet = jest.mocked(useWallet);
const mockedUseGetLeaderboardByAddress = jest.mocked(useGetLeaderboardByAddress);

const ReferralProbe = ({ label, canSave = false }: { label: string; canSave?: boolean }) => {
  const { storedReferralAddress, nextReferralAddress, getNextReferralAddress, saveReferrerAddress } = useReferral();

  return (
    <div>
      <span data-testid={`${label}-stored`}>{storedReferralAddress ?? "null"}</span>
      <span data-testid={`${label}-next`}>{nextReferralAddress || ""}</span>
      <span data-testid={`${label}-getter`}>{getNextReferralAddress() || ""}</span>
      {canSave ? (
        <button type="button" onClick={() => saveReferrerAddress(NEW_REFERRER)}>
          save-{label}
        </button>
      ) : null}
    </div>
  );
};

describe("useReferral shared state", () => {
  beforeEach(() => {
    localStorage.clear();

    mockedUseCustomRouter.mockReturnValue({
      getReferrerParameter: () => null,
      pathname: "/swap",
      query: {},
      replace: jest.fn(),
    } as unknown as ReturnType<typeof useCustomRouter>);

    mockedUseWallet.mockReturnValue({
      account: { address: ACCOUNT_ADDRESS },
    } as unknown as ReturnType<typeof useWallet>);

    mockedUseGetLeaderboardByAddress.mockReturnValue({
      data: null,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useGetLeaderboardByAddress>);
  });

  test("shares saved referral state across hook instances immediately", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <JotaiProvider>
          <ReferralProbe label="first" canSave />
          <ReferralProbe label="second" />
        </JotaiProvider>,
      );
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "save-first" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("first-stored").textContent).toBe(NEW_REFERRER);
      expect(screen.getByTestId("second-stored").textContent).toBe(NEW_REFERRER);
      expect(screen.getByTestId("second-next").textContent).toBe(NEW_REFERRER);
      expect(screen.getByTestId("second-getter").textContent).toBe(NEW_REFERRER);
    });
  });
});
