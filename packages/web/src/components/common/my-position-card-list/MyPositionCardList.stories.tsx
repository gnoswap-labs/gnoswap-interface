import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPositionCardList from "./MyPositionCardList";
import { fn } from "@storybook/test";

const meta = {
  title: "common/MyPositionCardList",
  component: MyPositionCardList,
  tags: ["autodocs"],
  argTypes: {
    isFetched: {
      options: [true, false],
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof MyPositionCardList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MyPositionCardList>]?: React.ComponentProps<typeof MyPositionCardList>[K];
}>;

export const Default: Story = {
  args: {
    positions: [],
    isFetched: true,
    currentIndex: 1,
    mobile: false,
    loadMore: true,
    movePoolDetail: fn(),
    onClickLoadMore: fn(),
  },
};
