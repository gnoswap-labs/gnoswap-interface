import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectDistributionDateInput from "./SelectDistributionDateInput";

const meta = {
  title: "incentivize/SelectDistributionDateInput",
  component: SelectDistributionDateInput,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectDistributionDateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Start Date",
    date: {
      year: 2023,
      month: 10,
      date: 1,
    },
    setDate: fn(),
  },
};
