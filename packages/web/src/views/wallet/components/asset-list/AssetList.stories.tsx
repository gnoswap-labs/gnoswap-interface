import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DEVICE_TYPE } from "@styles/media";

import { Asset } from "./asset-list-table/AssetListTable";
import AssetList from "./AssetList";

const dummyAssetList: Asset[] = [
  {
    type: "grc20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
    price: "0",
  },
  {
    type: "grc20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
    price: "0",
  },
];

export default {
  title: "wallet/AssetList",
  component: AssetList,
} as ComponentMeta<typeof AssetList>;

const Template: ComponentStory<typeof AssetList> = args => (
  <AssetList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  assets: dummyAssetList,
  isFetched: true,
  assetType: "All",
  invisibleZeroBalance: false,
  keyword: "",
  extended: false,
  hasLoader: true,
  changeAssetType: action("changeAssetType"),
  search: action("search"),
  toggleInvisibleZeroBalance: action("toggleInvisibleZeroBalance"),
  toggleExtended: action("toggleExtended"),
  deposit: action("deposit"),
  withdraw: action("withdraw"),
  breakpoint: DEVICE_TYPE.WEB,
  searchIcon: true,
  onTogleSearch: action("onTogleSearch"),
};
