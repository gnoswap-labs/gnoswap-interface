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
        connected={true}
        invisibleZeroBalance={false}
        showUnverifiedTokens={false}
        keyword=""
        changeAssetType={jest.fn()}
        toggleInvisibleZeroBalance={jest.fn()}
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
  const openFilters = () => fireEvent.mouseEnter(screen.getByRole("button", { name: "Wallet:assets.filters" }));

  it("renders both filter switches inside the Filters dropdown", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Wallet:assets.filters" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Wallet:assets.hideZeroAmt")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Wallet:assets.showUnverifiedTokens")).not.toBeInTheDocument();

    openFilters();
    expect(screen.getByLabelText("Wallet:assets.hideZeroAmt")).toBeInTheDocument();
    expect(screen.getByLabelText("Wallet:assets.showUnverifiedTokens")).toBeInTheDocument();
  });

  it("keeps the show-unverified switch default OFF and fires its toggle", () => {
    const toggleShowUnverifiedTokens = jest.fn();
    renderHeader({ toggleShowUnverifiedTokens });

    openFilters();
    const toggle = screen.getByLabelText("Wallet:assets.showUnverifiedTokens");
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);
    expect(toggleShowUnverifiedTokens).toHaveBeenCalledTimes(1);
  });

  it("keeps the hide-zero switch independent from the show-unverified switch", () => {
    const toggleInvisibleZeroBalance = jest.fn();
    const toggleShowUnverifiedTokens = jest.fn();
    renderHeader({ toggleInvisibleZeroBalance, toggleShowUnverifiedTokens });

    openFilters();
    fireEvent.click(screen.getByLabelText("Wallet:assets.hideZeroAmt"));

    expect(toggleInvisibleZeroBalance).toHaveBeenCalledTimes(1);
    expect(toggleShowUnverifiedTokens).not.toHaveBeenCalled();
  });

  it("shows the show-unverified switch even when the wallet is not connected", () => {
    renderHeader({ connected: false });

    openFilters();
    expect(screen.queryByLabelText("Wallet:assets.hideZeroAmt")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Wallet:assets.showUnverifiedTokens")).toBeInTheDocument();
  });

  it("renders both switches on mobile as well", () => {
    renderHeader({ breakpoint: DEVICE_TYPE.MOBILE, searchIcon: false });

    openFilters();
    expect(screen.getByLabelText("Wallet:assets.hideZeroAmt")).toBeInTheDocument();
    expect(screen.getByLabelText("Wallet:assets.showUnverifiedTokens")).toBeInTheDocument();
  });
});
