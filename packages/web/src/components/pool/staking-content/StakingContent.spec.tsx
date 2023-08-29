import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import StakingContent from "./StakingContent";
import {
  rewardInfoInit,
  stakingInit,
} from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("StakingContent Component", () => {
  it("StakingContent render", () => {
    const mockProps = {
      content: stakingInit,
      rewardInfo: rewardInfoInit,
      breakpoint: DEVICE_TYPE.WEB,
      mobile: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <StakingContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
