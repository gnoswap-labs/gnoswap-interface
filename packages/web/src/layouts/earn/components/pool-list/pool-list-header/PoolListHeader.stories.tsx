import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import PoolListHeader from "./PoolListHeader";
import { POOL_TYPE } from "../types";

const meta = {
  title: "earn/PoolList/PoolListHeader",
  component: PoolListHeader,
  tags: ["autodocs"],
  argTypes: {
    poolType: {
      control: "select",
      options: Object.values(POOL_TYPE),
      description: "현재 선택된 풀 타입",
    },
    breakpoint: {
      control: "select",
      options: Object.values(DEVICE_TYPE),
      description: "디바이스 타입",
    },
    searchIcon: {
      control: "boolean",
      description: "검색 아이콘 표시 여부",
    },
  },
} satisfies Meta<typeof PoolListHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolListHeader>]?: React.ComponentProps<typeof PoolListHeader>[K];
}>;

export const Default: Story = {
  args: {
    poolType: POOL_TYPE.ALL,
    changePoolType: fn(),
    search: fn(),
    keyword: "",
    breakpoint: DEVICE_TYPE.WEB,
    searchIcon: true,
    onTogleSearch: fn(),
  },
};
