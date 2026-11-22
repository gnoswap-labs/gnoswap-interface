import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DexEvent } from "@repositories/common/types";
import { ActivityData, dummyActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo, { MobileActivityInfo } from "./ActivityInfo";

const renderActivity = (time: string): void => {
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ActivityInfo
          item={{
            ...dummyActivityData,
            time,
          }}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );
};

describe("ActivityInfo Component", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-09-18T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the elapsed minute until the first full hour", () => {
    renderActivity("2026-09-18T11:00:01Z");

    expect(screen.getByText("59 minutes ago")).toBeInTheDocument();
  });

  it("keeps the elapsed hour until the next full hour", () => {
    renderActivity("2026-09-18T09:30:00Z");

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("keeps hourly output through 23 completed hours", () => {
    renderActivity("2026-09-17T13:30:00Z");

    expect(screen.getByText("22 hours ago")).toBeInTheDocument();
  });

  it("keeps the elapsed day until the next full day", () => {
    renderActivity("2026-09-15T12:00:01Z");

    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  it.each([
    [DexEvent.DCA_ORDER, "business:onchainActi.action.dcaOrder"],
    [DexEvent.DCA_SWAP, "business:onchainActi.action.dcaSwap"],
    [DexEvent.LIMIT_ORDER, "business:onchainActi.action.limitOrder"],
    [DexEvent.LIMIT_SWAP, "business:onchainActi.action.limitSwap"],
  ])("labels %s with its own action, selling token A for token B", (actionType, label) => {
    const item = { ...dummyActivityData, actionType, tokenB: { ...dummyActivityData.tokenB, symbol: "GNS" } } as ActivityData;

    for (const Info of [ActivityInfo, MobileActivityInfo]) {
      const { container, unmount } = render(
        <JotaiProvider>
          <GnoswapThemeProvider>
            <Info item={item} />
          </GnoswapThemeProvider>
        </JotaiProvider>,
      );
      const action = container.querySelector(".symbol-text")?.parentElement?.textContent ?? "";
      expect(action).toContain(label);
      expect(action).toContain("GNOT common:conjunction.for GNS");
      unmount();
    }
  });
});
