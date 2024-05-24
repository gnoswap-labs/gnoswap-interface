import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetListTable from "./AssetListTable";
import { DEVICE_TYPE } from "@styles/media";
import { Asset } from "@containers/asset-list-container/AssetListContainer";

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
  title: "wallet/AssetList/AssetListTable",
  component: AssetListTable,
} as ComponentMeta<typeof AssetListTable>;

const Template: ComponentStory<typeof AssetListTable> = args => (
  <AssetListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  assets: dummyAssetList,
  isFetched: true,
  deposit: action("deposit"),
  withdraw: action("withdraw"),
  breakpoint: DEVICE_TYPE.WEB,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  assets: [],
  isFetched: false,
};

export const NotFount = Template.bind({});
NotFount.args = {
  assets: [],
  isFetched: true,
};
