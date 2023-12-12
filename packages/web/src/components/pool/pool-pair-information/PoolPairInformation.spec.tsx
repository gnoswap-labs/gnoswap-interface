import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolPairInformation from "./PoolPairInformation";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();

describe("PoolPairInformation Component", () => {
  it("PoolPairInformation render", async () => {
    const pool = (await poolRepository.getPoolDetailByPoolPath());
    const mockProps = {
      pool,
      feeStr: "0.01%",
      menu: {
        title: "Earn",
        path: "/earn",
      },
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
