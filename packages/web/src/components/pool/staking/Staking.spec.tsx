import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import Staking from "./Staking";
import {
  rewardInfoInit,
  stakingInit,
} from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("Staking Component", () => {
  it("Staking render", () => {
    const mockProps = {
      info: stakingInit,
      rewardInfo: rewardInfoInit,
      breakpoint: DEVICE_TYPE.WEB,
      mobile: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Staking {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
