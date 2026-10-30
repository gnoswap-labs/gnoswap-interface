/// <reference types="jest" />

import React from "react";
import { ThemeProvider } from "@emotion/react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { GovernanceSummaryInfo } from "@repositories/governance";
import { getTheme } from "@utils/theme-utils";

import GovernanceSummary from "./GovernanceSummary";

jest.mock("react-i18next", () => {
  const { createInstance } = jest.requireActual("i18next");
  const governance = jest.requireActual("../../../../../public/locales/en/Governance.json");
  const common = jest.requireActual("../../../../../public/locales/en/common.json");
  const i18n = createInstance();
  i18n.init({
    lng: "en",
    initImmediate: false,
    resources: { en: { Governance: governance, common } },
  });
  return {
    useTranslation: (namespace?: string | string[]) => ({
      t: namespace ? i18n.getFixedT("en", namespace) : (key: string) => key,
      i18n,
    }),
  };
});

jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({
    isMobile: false,
  }),
}));

jest.mock("@hooks/token/data/use-token-pricing", () => ({
  useTokenPricing: () => ({
    getTokenUSDPrice: () => 0,
    tokens: [],
  }),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({
    getGnotPath: () => ({}),
  }),
}));

jest.mock("@providers/gnoswap-theme-provider/GnoswapThemeProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@components/common/tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({ children, FloatingContent }: { children: React.ReactNode; FloatingContent: React.ReactNode }) => (
    <>
      {children}
      {FloatingContent}
    </>
  ),
}));

jest.mock("@components/common/divider/divider", () => ({
  Divider: () => <div />,
}));

jest.mock("@components/common/missing-logo/MissingLogo", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("@components/common/video-guide-trigger/VideoGuideTrigger", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <button type="button">{text}</button>,
}));

jest.mock("../token-chip/TokenChip", () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock("../info-box/InfoBox", () => ({
  __esModule: true,
  default: ({ title, value }: { title: string; value: React.ReactNode }) => (
    <div>
      {title}:{value}
    </div>
  ),
}));

jest.mock("./GovernanceSummary.styles", () => ({
  __esModule: true,
  GovernanceSummaryWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  GovernanceSummaryTooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("./GovernanceAPRHistory.styles", () => ({
  __esModule: true,
  GovernanceAPRHistoryContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const baseGovernanceSummary: GovernanceSummaryInfo = {
  delegationInfo: {
    totalDelegationAmount: "0",
    governanceDelegationAmount: "0",
    launchpadDelegationAmount: "0",
  },
  delegatedRatio: "0",
  apy: "0",
  communityPoolUsd: "0",
};

const renderGovernanceSummary = (overrides: Partial<GovernanceSummaryInfo> = {}) => {
  render(
    <JotaiProvider>
      <ThemeProvider theme={getTheme("dark")}>
        <GovernanceSummary
          governanceSummary={{
            ...baseGovernanceSummary,
            ...overrides,
          }}
          governanceCommunityPoolBalances={[]}
          isLoading={false}
          onOpenVideoGuide={jest.fn()}
        />
      </ThemeProvider>
    </JotaiProvider>,
  );
};

describe("GovernanceSummary Component", () => {
  it.each<[string, string]>([
    ["0", "0%"],
    ["0.725", "72.5%"],
    ["1", "100%"],
  ])("renders delegated ratio %s as %s", (delegatedRatio, expectedDelegatedRatio) => {
    renderGovernanceSummary({ delegatedRatio });

    expect(screen.getByText(`Governance:summary.delRatio.title:${expectedDelegatedRatio}`)).toBeDefined();
  });

  it("shows missing components as unavailable without deriving them from the total, and zero as 0.00%", () => {
    renderGovernanceSummary({ apy: "3.21", protocolFeeApr: "0" });

    expect(screen.getByText("3.21%")).toBeDefined();
    expect(screen.getByText("0.00%")).toBeDefined();
    expect(screen.getAllByText("Not available")).toHaveLength(1);
  });

  it("opens daily APR history on click and dismisses it with Escape", async () => {
    renderGovernanceSummary({
      apy: "12.34",
      protocolFeeApr: "5.84",
      emissionApr: "6.50",
      aprHistory: [
        {
          date: "2026-10-14",
          apr: "12.52",
          protocolFeeApr: "6.02",
          emissionApr: "6.50",
          estimated: true,
          asOf: "2026-10-14T09:00:00Z",
        },
      ],
    });

    const trigger = screen.getByRole("button", { name: /APR history/ });
    expect(trigger).toHaveAccessibleName(/12\.34%/);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("table")).toBeNull();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("table")).toBeDefined();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("announces an unavailable total when opening history without a valid headline APR", () => {
    renderGovernanceSummary({
      apy: "",
      aprHistory: [{ date: "2026-10-14", apr: "12.52", estimated: false }],
    });
    expect(screen.getByRole("button", { name: /Not available.*APR history/ })).toBeDefined();
  });

  it("keeps all seven UTC dates reachable when the API supplies no daily rows", async () => {
    renderGovernanceSummary({ apy: "" });

    fireEvent.click(screen.getByRole("button", { name: /Not available.*APR history/ }));
    const dialog = await screen.findByRole("dialog");
    const table = within(dialog).getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(8);
    expect(within(table).getAllByText("—")).toHaveLength(21);
    expect(within(table).queryByText("0.00%")).toBeNull();
  });
});
