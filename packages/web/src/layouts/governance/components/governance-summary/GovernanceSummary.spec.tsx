/// <reference types="jest" />

import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { GovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "./GovernanceSummary";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({
    isMobile: false,
  }),
}));

jest.mock("@hooks/token/data/use-token-price-helper", () => ({
  useTokenPriceHelper: () => ({
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
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
    <div>{`${title}:${typeof value === "string" ? value : ""}`}</div>
  ),
}));

jest.mock("./GovernanceSummary.styles", () => ({
  __esModule: true,
  GovernanceSummaryWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  GovernanceSummaryTooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
});
