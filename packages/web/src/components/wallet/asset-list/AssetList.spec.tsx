import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetList from "./AssetList";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";

describe("AssetList Component", () => {
  it("AssetList render", () => {
    const mockProps = {
      assets: [],
      isLoading: false,
      error: null,
      assetType: "All" as ASSET_FILTER_TYPE,
      invisibleZeroBalance: false,
      keyword: "",
      extended: false,
      hasLoader: true,
      changeAssetType: () => null,
      search: () => null,
      toggleInvisibleZeroBalance: () => null,
      toggleExtended: () => null,
      deposit: () => null,
      withdraw: () => null,
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <AssetList {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
