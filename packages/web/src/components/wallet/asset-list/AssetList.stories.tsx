import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AssetList from "./AssetList";

export default {
  title: "wallet/AssetList",
  component: AssetList,
} as ComponentMeta<typeof AssetList>;

const Template: ComponentStory<typeof AssetList> = args => (
  <AssetList {...args} />
);

export const Default = Template.bind({});
Default.args = {};
