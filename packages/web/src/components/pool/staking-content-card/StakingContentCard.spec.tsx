import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import StakingContentCard from "./StakingContentCard";
import { stakingInit } from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("StakingContentCard Component", () => {
  it("StakingContentCard render", () => {
    const mockProps = {
      item: stakingInit[0],
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <StakingContentCard {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
