import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import MyPositionCard from "./MyPositionCard";
import { poolPairInit } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("MyPositionCard Component", () => {
  it("MyPositionCard render", () => {
    const mockProps = {
      content: poolPairInit.poolInfo,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <MyPositionCard {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
