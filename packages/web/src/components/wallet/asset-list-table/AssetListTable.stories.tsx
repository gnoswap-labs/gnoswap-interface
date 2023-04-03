import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import AssetListTable from "./AssetListTable";

export default {
  title: "wallet/AssetList/AssetListTable",
  component: AssetListTable,
} as ComponentMeta<typeof AssetListTable>;

const Template: ComponentStory<typeof AssetListTable> = args => (
  <AssetListTable {...args} />
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
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  assets: [],
  isFetched: false,
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};

export const NotFount = Template.bind({});
NotFount.args = {
  assets: [],
  isFetched: true,
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};
