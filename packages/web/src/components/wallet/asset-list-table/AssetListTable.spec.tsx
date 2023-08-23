import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetListTable from "./AssetListTable";
import { ASSET_HEAD } from "@containers/asset-list-container/AssetListContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("AssetListTable Component", () => {
  it("AssetListTable render", () => {
    const mockProps = {
      assets: [],
      isFetched: true,
      error: null,
      isLoading: false,
      deposit: () => null,
      withdraw: () => null,
      sortOption: undefined,
      sort: () => {
        return;
      },
      isSortOption: () => true,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <AssetListTable {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
