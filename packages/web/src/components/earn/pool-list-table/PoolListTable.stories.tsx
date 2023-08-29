import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolListTable from "./PoolListTable";
import { dummyPoolList } from "@containers/pool-list-container/PoolListContainer";
import { action } from "@storybook/addon-actions";

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
  routeItem: action("routeItem"),
  sortOption: undefined,
  sort: action("sort"),
  isSortOption: () => true,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  pools: [],
  isFetched: false,
  routeItem: action("routeItem"),
  sortOption: undefined,
  sort: action("sort"),
  isSortOption: () => true,
};

export const NotFount = Template.bind({});
NotFount.args = {
  pools: [],
  isFetched: true,
  routeItem: action("routeItem"),
  sortOption: undefined,
  sort: action("sort"),
  isSortOption: () => true,
};
