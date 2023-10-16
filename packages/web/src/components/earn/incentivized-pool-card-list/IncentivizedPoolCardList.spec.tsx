import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import IncentivizedPoolCardList, { IncentivizedPoolCardListProps } from "./IncentivizedPoolCardList";

describe("IncentivizedPoolCardList Component", () => {
  it("IncentivizedPoolCardList render", () => {
    const args: IncentivizedPoolCardListProps = {
      currentIndex: 1,
      isFetched: true,
      incentivizedPools: [],
      mobile: false,
      routeItem: () => { return; }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <IncentivizedPoolCardList {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});