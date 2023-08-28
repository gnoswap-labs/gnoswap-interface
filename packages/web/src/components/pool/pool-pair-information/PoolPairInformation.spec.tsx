import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInformation from "./PoolPairInformation";
import {
  menuInit,
  poolPairInit,
} from "@containers/pool-pair-information-container/PoolPairInformationContainer";

describe("PoolPairInformation Component", () => {
  it("PoolPairInformation render", () => {
    const mockProps = {
      info: poolPairInit,
      menu: menuInit,
      onClickPath: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <PoolPairInformation {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
