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
type Story = StoryObj<typeof MyPositionCardList>;

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
