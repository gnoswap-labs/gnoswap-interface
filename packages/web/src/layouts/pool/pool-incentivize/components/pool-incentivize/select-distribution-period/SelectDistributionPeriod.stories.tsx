import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectDistributionPeriod from "./SelectDistributionPeriod";

const meta = {
  title: "incentivize/SelectDistributionPeriod",
  component: SelectDistributionPeriod,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectDistributionPeriod>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SelectDistributionPeriod>]?: React.ComponentProps<
    typeof SelectDistributionPeriod
  >[K];
}>;

export const Default: Story = {
  args: {
    startDate: {
      year: 2023,
      month: 10,
      date: 1,
    },
    period: 90,
    setStartDate: fn(),
    setPeriod: fn(),
  },
};
