import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import AssetList from "./AssetList";
import { Asset } from "./asset-list-table/AssetListTable";

const dummyAssetList: Asset[] = [
  {
    type: "GRC20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    displaySymbol: "BAR",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
    price: "0",
  },
  {
    type: "GRC20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    displaySymbol: "BAR",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
    price: "0",
  },
];

const meta = {
  title: "wallet/AssetList",
  component: AssetList,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof AssetList>;

export default meta;
type Story = StoryObj<typeof AssetList>;

export const Default: Story = {
  args: {
    assets: dummyAssetList,
    isFetched: true,
    assetType: "All",
    invisibleZeroBalance: false,
    keyword: "",
    extended: false,
    hasLoader: true,
    changeAssetType: fn(),
    search: fn(),
    toggleInvisibleZeroBalance: fn(),
    toggleShowUnverifiedTokens: fn(),
    showUnverifiedTokens: false,
    toggleExtended: fn(),
    deposit: fn(),
    withdraw: fn(),
    breakpoint: DEVICE_TYPE.WEB,
    searchIcon: true,
    onTogleSearch: fn(),
  },
};
