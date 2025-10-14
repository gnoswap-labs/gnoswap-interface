import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import PoolList from "./PoolList";
import { POOL_TYPE } from "./types";

const meta = {
  title: "earn/PoolList",
  component: PoolList,
  tags: ["autodocs"],
  argTypes: {
    poolType: {
      control: "select",
      options: Object.values(POOL_TYPE),
      description: "풀 타입 필터",
    },
    breakpoint: {
      control: "select",
      options: Object.values(DEVICE_TYPE),
      description: "디바이스 타입",
    },
    currentPage: {
      control: { type: "number", min: 0 },
      description: "현재 페이지",
    },
    totalPage: {
      control: { type: "number", min: 1 },
      description: "전체 페이지 수",
    },
    isFetched: {
      control: "boolean",
      description: "데이터 로딩 완료 여부",
    },
  },
} satisfies Meta<typeof PoolList>;

export default meta;
type Story = StoryObj<typeof PoolList>;

export const Default: Story = {
  args: {
    pools: [],
    poolType: POOL_TYPE.ALL,
    changePoolType: fn(),
    search: fn(),
    currentPage: 0,
    totalPage: 10,
    movePage: fn(),
    breakpoint: DEVICE_TYPE.WEB,
    routeItem: fn(),
    isSortOption: () => false,
    isFetched: true,
  },
};
