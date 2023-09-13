import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import IncentivizedPoolCard, { IncentivizedPoolCardProps } from "./IncentivizedPoolCard";
import { poolDummy } from "./incentivized-pool-dummy";

describe("IncentivizedPoolCard Component", () => {
  it("IncentivizedPoolCard render", () => {
    const args: IncentivizedPoolCardProps = {
      item: poolDummy[0],
      routeItem: () => { return; }
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <IncentivizedPoolCard {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});