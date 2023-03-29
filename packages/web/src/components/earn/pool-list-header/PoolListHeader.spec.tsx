import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import PoolListHeader from "./PoolListHeader";
import { POOL_TYPE } from "@containers/pool-list-container/PoolListContainer";

describe("PoolListHeader Component", () => {
  it("PoolListHeader render", () => {
    const mockProps = {
      poolType: POOL_TYPE.ALL,
      changePoolType: () => {},
      search: () => {},
      keyword: "",
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <PoolListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
