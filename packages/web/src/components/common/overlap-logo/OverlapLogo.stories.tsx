import type { Meta, StoryObj } from "@storybook/nextjs";
import OverlapLogo from "./OverlapLogo";

const meta = {
  title: "common/OverlapLogo",
  component: OverlapLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof OverlapLogo>;

export default meta;
type Story = StoryObj<typeof OverlapLogo>;

export const Default: Story = {
  args: {
    logos: [
      {
        src: "https://picsum.photos/id/7/36/36",
        symbol: "",
        displaySymbol: "",
      },
      {
        src: "https://picsum.photos/id/101/36/36",
        symbol: "",
        displaySymbol: "",
      },
    ],
    size: 36,
  },
};
