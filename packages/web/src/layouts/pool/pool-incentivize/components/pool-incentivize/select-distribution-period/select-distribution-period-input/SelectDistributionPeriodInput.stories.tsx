import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectDistributionPeriodInput from "./SelectDistributionPeriodInput";

const periods = [90, 120, 150, 180, 210, 240];

const meta = {
  title: "incentivize/SelectDistributionPeriodInput",
  component: SelectDistributionPeriodInput,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectDistributionPeriodInput>;

export default meta;
type Story = StoryObj<typeof SelectDistributionPeriodInput>;

export const Default: Story = {
  args: {
    title: "Distribution Period",
    period: 90,
    periods,
    changePeriod: fn(),
  },
};
