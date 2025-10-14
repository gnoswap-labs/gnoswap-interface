import type { Meta, StoryObj } from "@storybook/nextjs";
import DoubleLogo from "./DoubleLogo";

const meta = {
  title: "common/DoubleLogo",
  component: DoubleLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof DoubleLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    left: "https://picsum.photos/id/7/36/36",
    right: "https://picsum.photos/id/101/36/36",
    size: 36,
    overlap: 8,
  },
};
