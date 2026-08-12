import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import AssetListHeader, { ASSET_FILTER_TYPE } from "./AssetListHeader";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderHeader = (overrides: Partial<React.ComponentProps<typeof AssetListHeader>> = {}) =>
  render(
    <GnoswapThemeProvider>
      <AssetListHeader
        assetType={ASSET_FILTER_TYPE.ALL}
        showUnverifiedTokens={false}
        keyword=""
        changeAssetType={jest.fn()}
        toggleShowUnverifiedTokens={jest.fn()}
        search={jest.fn()}
        breakpoint={DEVICE_TYPE.WEB}
        searchIcon={false}
        onTogleSearch={jest.fn()}
        searchRef={React.createRef<HTMLDivElement>()}
        {...overrides}
      />
    </GnoswapThemeProvider>,
  );

describe("AssetListHeader", () => {
  it("renders the show-unverified switch directly and removes the Filters/zero-balance controls", () => {
    renderHeader();

    expect(screen.getByLabelText("common:tokenList.showUnverifiedTokens")).toBeInTheDocument();
    expect(screen.queryByText("Wallet:assets.filters")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Wallet:assets.hideZeroAmt")).not.toBeInTheDocument();
  });

  it("keeps the show-unverified switch default OFF and fires its toggle", () => {
    const toggleShowUnverifiedTokens = jest.fn();
    renderHeader({ toggleShowUnverifiedTokens });

    const toggle = screen.getByLabelText("common:tokenList.showUnverifiedTokens");
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);
    expect(toggleShowUnverifiedTokens).toHaveBeenCalledTimes(1);
  });

  it("renders the same switch on mobile as well", () => {
    renderHeader({ breakpoint: DEVICE_TYPE.MOBILE, searchIcon: false });

    expect(screen.getByLabelText("common:tokenList.showUnverifiedTokens")).toBeInTheDocument();
    expect(screen.queryByLabelText("Wallet:assets.hideZeroAmt")).not.toBeInTheDocument();
  });
});
