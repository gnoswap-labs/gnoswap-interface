import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import EarnMyPositionsUnconnected from "./EarnMyPositionsUnconnected";

const meta = {
  title: "earn/EarnMyPositionsUnconnected",
  component: EarnMyPositionsUnconnected,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositionsUnconnected>;

export default meta;
type Story = StoryObj<typeof EarnMyPositionsUnconnected>;

export const Default: Story = {
  args: {
    connect: fn(),
  },
};
