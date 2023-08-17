import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { dummyAssetList } from "@containers/asset-list-container/AssetListContainer";
import AssetListTable from "./AssetListTable";
import { DEVICE_TYPE } from "@styles/media";

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
  deviceType: DEVICE_TYPE.WEB,
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
