import type { Meta, StoryObj } from "@storybook/nextjs";
import OverlapTokenLogo from "./OverlapTokenLogo";

const meta = {
  title: "common/OverlapTokenLogo",
  component: OverlapTokenLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof OverlapTokenLogo>;

export default meta;
type Story = StoryObj<typeof OverlapTokenLogo>;

export const Default: Story = {
  args: {
    size: 36,
  },
};
