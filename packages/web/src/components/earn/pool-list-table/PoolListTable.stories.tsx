import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolListTable from "./PoolListTable";
import { dummyPoolList } from "@containers/pool-list-container/PoolListContainer";

export default {
  title: "earn/PoolList/PoolListTable",
  component: PoolListTable,
} as ComponentMeta<typeof PoolListTable>;

const Template: ComponentStory<typeof PoolListTable> = args => (
  <PoolListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  pools: dummyPoolList,
  isFetched: true,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  pools: [],
  isFetched: false,
};

export const NotFount = Template.bind({});
NotFount.args = {
  pools: [],
  isFetched: true,
};
