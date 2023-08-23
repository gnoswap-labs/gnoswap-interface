import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetList from "./AssetList";
import { dummyAssetList } from "@containers/asset-list-container/AssetListContainer";
import { DEVICE_TYPE } from "@styles/media";

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
