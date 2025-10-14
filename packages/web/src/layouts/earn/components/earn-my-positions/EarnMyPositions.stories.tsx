import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import EarnMyPositions from "./EarnMyPositions";

const meta = {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositions>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof EarnMyPositions>]?: React.ComponentProps<typeof EarnMyPositions>[K];
}>;

export const UnConnected: Story = {
  args: {
    connected: false,
    fetched: true,
    positions: [],
    connect: fn(),
    moveEarnAdd: fn(),
    movePoolDetail: fn(),
  },
};

export const NoLiquidity: Story = {
  args: {
    connected: true,
    fetched: true,
    positions: [],
    connect: fn(),
    moveEarnAdd: fn(),
    movePoolDetail: fn(),
  },
};

export const CardList: Story = {
  args: {
    connected: true,
    fetched: true,
    positions: [],
    connect: fn(),
    moveEarnAdd: fn(),
    movePoolDetail: fn(),
  },
};
