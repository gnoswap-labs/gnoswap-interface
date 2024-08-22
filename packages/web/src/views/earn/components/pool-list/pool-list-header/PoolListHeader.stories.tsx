import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { DEVICE_TYPE } from "@styles/media";

import PoolListHeader from "./PoolListHeader";
import { POOL_TYPE } from "../types";

export default {
  title: "earn/PoolList/PoolListHeader",
  component: PoolListHeader,
} as ComponentMeta<typeof PoolListHeader>;

const Template: ComponentStory<typeof PoolListHeader> = args => (
  <PoolListHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  poolType: POOL_TYPE.ALL,
  changePoolType: action("changePoolType"),
  search: action("search"),
  keyword: "",
  breakpoint: DEVICE_TYPE.WEB,
  searchIcon: true,
  onTogleSearch: action("onTogleSearch"),
};