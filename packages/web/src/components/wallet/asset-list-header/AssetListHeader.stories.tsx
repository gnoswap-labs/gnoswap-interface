import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetListHeader from "./AssetListHeader";

export default {
  title: "wallet/AssetList/AssetListHeader",
  component: AssetListHeader,
} as ComponentMeta<typeof AssetListHeader>;

const Template: ComponentStory<typeof AssetListHeader> = args => (
  <div
    style={{
      color: "#FFF",
      backgroundColor: "#0A0E17",
    }}
  >
    <AssetListHeader {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  assetType: "All",
  invisibleZeroBalance: true,
  changeAssetType: action("changeAssetType"),
  toggleInvisibleZeroBalance: action("toggleInvisibleZeroBalance"),
  search: action("search"),
};
