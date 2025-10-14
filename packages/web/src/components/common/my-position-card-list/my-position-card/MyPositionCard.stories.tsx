import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPositionCard from "./MyPositionCard";
import { fn } from "@storybook/test";

const meta = {
  title: "common/MyPositionCard",
  component: MyPositionCard,
  tags: ["autodocs"],
} satisfies Meta<typeof MyPositionCard>;

export default meta;
type Story = StoryObj<typeof MyPositionCard>;

export const Staked: Story = {
  args: {},
};

export const Unstaked: Story = {
  args: {
    movePoolDetail: fn(),
  },
};
