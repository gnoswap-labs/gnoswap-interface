import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import AssetListLoader from "./AssetListLoader";

describe("AssetListLoader Component", () => {
  it("AssetListLoader render", () => {
    const mockProps = {
      extended: false,
      toggleExtended: () => null
    };

    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <AssetListLoader {...mockProps} />
        </GnoswapThemeProvider>
      </RecoilRoot>
    );
  });
});
