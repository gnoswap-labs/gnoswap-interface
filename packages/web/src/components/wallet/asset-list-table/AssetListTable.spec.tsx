import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetListTable from "./AssetListTable";

describe("AssetListTable Component", () => {
  it("AssetListTable render", () => {
    const mockProps = {
      assets: [],
      isFetched: true,
      error: null,
      isLoading: false,
      deposit: () => null,
      withdraw: () => null,
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <AssetListTable {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
