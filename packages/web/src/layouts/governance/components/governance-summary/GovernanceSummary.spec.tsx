/// <reference types="jest" />

import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { GovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "./GovernanceSummary";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en-US" },
  }),
}));

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

const renderGovernanceSummary = (delegatedRatio: string) => {
  render(
    <JotaiProvider>
      <GovernanceSummary
        governanceSummary={{
          ...baseGovernanceSummary,
          delegatedRatio,
        }}
        governanceCommunityPoolBalances={[]}
        isLoading={false}
        onOpenVideoGuide={jest.fn()}
      />
    </JotaiProvider>,
  );
};

describe("GovernanceSummary Component", () => {
  it.each<[string, string]>([
    ["0", "0%"],
    ["0.725", "72.5%"],
    ["1", "100%"],
  ])("renders delegated ratio %s as %s", (delegatedRatio, expectedDelegatedRatio) => {
    renderGovernanceSummary(delegatedRatio);

    expect(screen.getByText(`Governance:summary.delRatio.title:${expectedDelegatedRatio}`)).toBeDefined();
  });

  it("shows the API daily APRs and their percentage-point difference from the displayed average", () => {
    render(
      <JotaiProvider>
        <GovernanceSummary
          governanceSummary={{
            ...baseGovernanceSummary,
            apy: "5.84",
            aprHistory: [
              { date: "2026-10-14", apr: "6.02", estimated: true, asOf: "2026-10-14T09:00:00Z" },
              { date: "2026-10-13", apr: "5.95", estimated: false },
              { date: "2026-10-11", apr: "5.80", estimated: false },
              { date: "2026-10-10", apr: "5.84", estimated: false },
            ],
          }}
          governanceCommunityPoolBalances={[]}
          isLoading={false}
          onOpenVideoGuide={jest.fn()}
        />
      </JotaiProvider>,
    );

    expect(screen.getByRole("button", { name: "5.84%" })).toBeDefined();
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);
    expect(rows[1]).toHaveTextContent("10/14 (Wed)");
    expect(rows[1]).toHaveTextContent("≈ 09:00 UTC");
    expect(rows[1]).toHaveTextContent("6.02%");
    expect(rows[1]).toHaveTextContent("+0.18 pp");
    expect(rows[2]).toHaveTextContent("+0.11 pp");
    expect(rows[3]).toHaveTextContent("-0.04 pp");
    expect(rows[4]).toHaveTextContent("0.00 pp");
    expect(screen.queryByText("10/12 (Mon)")).toBeNull();
  });

  it("does not offer a history tooltip before the API supplies daily rows", () => {
    renderGovernanceSummary("0");

    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.queryByRole("button", { name: "0%" })).toBeNull();
  });
});
