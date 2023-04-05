import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import PoolList from "./PoolList";
import {
  POOL_TYPE,
  dummyPoolList,
} from "@containers/pool-list-container/PoolListContainer";

export default {
  title: "earn/PoolList",
  component: PoolList,
} as ComponentMeta<typeof PoolList>;

const Template: ComponentStory<typeof PoolList> = args => (
  <PoolList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  pools: dummyPoolList,
  poolType: POOL_TYPE.ALL,
  changePoolType: action("changePoolType"),
  search: action("search"),
  currentPage: 0,
  totalPage: 10,
  movePage: action("movePage"),
};
