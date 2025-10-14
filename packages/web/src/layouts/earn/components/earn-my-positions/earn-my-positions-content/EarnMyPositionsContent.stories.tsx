import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import EarnMyPositionsContent from "./EarnMyPositionsContent";

const meta = {
  title: "earn/EarnMyPositionsContent",
  component: EarnMyPositionsContent,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositionsContent>;

export default meta;
type Story = StoryObj<typeof EarnMyPositionsContent>;

export const UnConnected: Story = {
  args: {
    connected: false,
    fetched: true,
    positions: [],
    connect: fn(),
    movePoolDetail: fn(),
  },
};

export const NoLiquidity: Story = {
  args: {
    connected: true,
    fetched: true,
    positions: [],
    connect: fn(),
    movePoolDetail: fn(),
  },
};

export const CardList: Story = {
  args: {
    connected: true,
    fetched: true,
    positions: [],
    connect: fn(),
    movePoolDetail: fn(),
  },
};
