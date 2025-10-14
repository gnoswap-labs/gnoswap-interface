import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import POOLS from "@repositories/pool/mock/pools.json";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolModel } from "@models/pool/pool-model";

import PoolListTable from "./PoolListTable";

const pool = POOLS.pools[0] as unknown as PoolModel;
const listInfo = PoolMapper.toListInfo(pool);

const meta = {
  title: "earn/PoolList/PoolListTable",
  component: PoolListTable,
  tags: ["autodocs"],
  argTypes: {
    isFetched: {
      control: "boolean",
      description: "데이터 로딩 완료 여부",
    },
    sortOption: {
      control: "select",
      options: [undefined, "tvl", "apr", "volume24h", "fees24h"],
      description: "정렬 옵션",
    },
  },
} satisfies Meta<typeof PoolListTable>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolListTable>]?: React.ComponentProps<typeof PoolListTable>[K];
}>;

export const Default: Story = {
  args: {
    pools: [listInfo],
    isFetched: true,
    routeItem: fn(),
    sortOption: undefined,
    sort: fn(),
    isSortOption: () => true,
  },
};

export const Skeleton: Story = {
  args: {
    pools: [],
    isFetched: false,
    routeItem: fn(),
    sortOption: undefined,
    sort: fn(),
    isSortOption: () => true,
  },
};

export const NotFound: Story = {
  args: {
    pools: [],
    isFetched: true,
    routeItem: fn(),
    sortOption: undefined,
    sort: fn(),
    isSortOption: () => true,
  },
};
