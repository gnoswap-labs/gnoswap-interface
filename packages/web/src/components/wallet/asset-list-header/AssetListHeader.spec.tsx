import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetListHeader from "./AssetListHeader";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";
import { DEVICE_TYPE } from "@styles/media";

describe("AssetListHeader Component", () => {
  it("AssetListHeader render", () => {
    const mockProps = {
      assetType: ASSET_FILTER_TYPE.ALL,
      invisibleZeroBalance: false,
      keyword: "",
      changeAssetType: () => null,
      toggleInvisibleZeroBalance: () => null,
      search: () => null,
      deviceType: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <AssetListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
