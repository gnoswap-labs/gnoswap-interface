import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetListHeader from "./AssetListHeader";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";

describe("AssetListHeader Component", () => {
  it("AssetListHeader render", () => {
    const mockProps = {
      assetType: "All" as ASSET_FILTER_TYPE,
      invisibleZeroBalance: false,
      keyword: "",
      changeAssetType: () => null,
      toggleInvisibleZeroBalance: () => null,
      search: () => null,
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <AssetListHeader {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>
    );
  });
});
