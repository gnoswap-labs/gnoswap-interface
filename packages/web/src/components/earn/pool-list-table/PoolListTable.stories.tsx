import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolListTable from "./PoolListTable";
import { action } from "@storybook/addon-actions";
import POOLS from "@repositories/pool/mock/pools.json";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolModel } from "@models/pool/pool-model";

const pool = POOLS.pools[0] as PoolModel;

const listInfo = PoolMapper.toListInfo(pool);

export default {
  title: "earn/PoolList/PoolListTable",
  component: PoolListTable,
} as ComponentMeta<typeof PoolListTable>;

const Template: ComponentStory<typeof PoolListTable> = args => (
  <PoolListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  pools: [listInfo],
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

export const NotFound = Template.bind({});
NotFound.args = {
  pools: [],
  isFetched: true,
  routeItem: action("routeItem"),
  sortOption: undefined,
  sort: action("sort"),
  isSortOption: () => true,
};
