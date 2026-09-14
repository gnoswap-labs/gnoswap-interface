import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import StakingHeader from "./StakingHeader";
import { DEVICE_TYPE } from "@styles/media";

describe("StakingHeader Component", () => {
  it("StakingHeader render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      isDisabledButton: false,
      handleClickStakeRedirect: () => null,
      handleClickUnStakeRedirect: () => null,
      canUnstake: false,
      isOtherPosition: false,
      canStake: false,
      onOpenVideoGuide: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <StakingHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
