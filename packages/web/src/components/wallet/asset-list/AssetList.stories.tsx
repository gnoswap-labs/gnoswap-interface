import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import AssetList from "./AssetList";

export default {
  title: "wallet/AssetList",
  component: AssetList,
} as ComponentMeta<typeof AssetList>;

const Template: ComponentStory<typeof AssetList> = args => (
  <AssetList {...args} />
);

const assets: Asset[] = [
  {
    id: "BTC",
    logoUri:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    type: "NATIVE",
    name: "Bitcoin",
    symbol: "BTC",
    chain: "Gnoland",
    balance: "0",
  },
  {
    id: "GNOS",
    logoUri:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB98d4C97425d9908E66E53A6fDf673ACcA0BE986/logo.png",
    type: "NATIVE",
    name: "Gnoswap",
    symbol: "GNOS",
    chain: "Gnoland",
    balance: "0",
  },
];

const defaultAssets: Asset[] = [
  ...assets,
  ...assets,
  ...assets,
  ...assets,
  ...assets,
];

export const Default = Template.bind({});
Default.args = {
  assets: defaultAssets,
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
};
