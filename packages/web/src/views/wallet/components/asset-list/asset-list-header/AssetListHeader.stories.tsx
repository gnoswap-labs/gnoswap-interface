import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DEVICE_TYPE } from "@styles/media";

import AssetListHeader, { ASSET_FILTER_TYPE } from "./AssetListHeader";

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
  breakpoint: DEVICE_TYPE.WEB,
  searchIcon: true,
  onTogleSearch: action("onTogleSearch"),
};
