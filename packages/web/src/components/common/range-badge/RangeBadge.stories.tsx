import type { Meta, StoryObj } from "@storybook/nextjs";
import RangeBadge from "./RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";

const meta = {
  title: "common/RangeBadge",
  component: RangeBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: ["IN", "OUT"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof RangeBadge>;

export default meta;
type Story = StoryObj<typeof RangeBadge>;

export const Default: Story = {
  args: {
    status: RANGE_STATUS_OPTION.IN,
  },
};
