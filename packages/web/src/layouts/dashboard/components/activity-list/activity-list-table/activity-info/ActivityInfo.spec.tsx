import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DexEvent } from "@repositories/common/types";
import { ActivityData, dummyActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo, { MobileActivityInfo } from "./ActivityInfo";

describe("ActivityInfo Component", () => {
  it("ActivityInfo render", () => {
    const mockProps = {
      item: dummyActivityData,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ActivityInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
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
