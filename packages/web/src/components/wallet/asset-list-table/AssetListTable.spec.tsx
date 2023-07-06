import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
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
      <JotaiProvider>
        <GnoswapThemeProvider>
          <AssetListTable {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
