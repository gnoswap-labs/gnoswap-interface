import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import AssetListTable, { Asset } from "./AssetListTable";

const dummyAssetList: Asset[] = [
  {
    type: "GRC20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    tokenId: "gno.land/r/bar.BAR",
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
    tokenId: "gno.land/r/bar.BAR",
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
  title: "wallet/AssetList/AssetListTable",
  component: AssetListTable,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof AssetListTable>;

export default meta;
type Story = StoryObj<typeof AssetListTable>;

export const Default: Story = {
  args: {
    assets: dummyAssetList,
    isFetched: true,
    deposit: fn(),
    withdraw: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const Skeleton: Story = {
  args: {
    assets: [],
    isFetched: false,
  },
};

export const NotFound: Story = {
  args: {
    assets: [],
    isFetched: true,
  },
};
