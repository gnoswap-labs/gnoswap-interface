import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetListHeader from "./AssetListHeader";
import { ASSET_FILTER_TYPE } from "@containers/asset-list-container/AssetListContainer";

export default {
  title: "wallet/AssetList/AssetListHeader",
  component: AssetListHeader,
} as ComponentMeta<typeof AssetListHeader>;

const Template: ComponentStory<typeof AssetListHeader> = args => (
  <AssetListHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  assetType: ASSET_FILTER_TYPE.ALL,
  invisibleZeroBalance: true,
  changeAssetType: action("changeAssetType"),
  toggleInvisibleZeroBalance: action("toggleInvisibleZeroBalance"),
  search: action("search"),
};
