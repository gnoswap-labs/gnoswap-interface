import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetListLoader from "./AssetListLoader";

export default {
  title: "wallet/AssetList/AssetListLoader",
  component: AssetListLoader,
} as ComponentMeta<typeof AssetListLoader>;

const Template: ComponentStory<typeof AssetListLoader> = args => (
  <div style={{
    color: "#FFF",
    backgroundColor: "#0A0E17",
  }}>
    <AssetListLoader {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  extended: false,
  toggleExtended: action("loadMoreAssets")
};

export const Extend = Template.bind({});
Extend.args = {
  extended: true,
  toggleExtended: action("loadMoreAssets")
};
