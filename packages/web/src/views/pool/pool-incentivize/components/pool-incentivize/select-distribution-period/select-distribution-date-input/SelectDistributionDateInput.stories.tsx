import SelectDistributionDateInput, { type SelectDistributionDateInputProps } from "./SelectDistributionDateInput";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "incentivize/SelectDistributionDateInput",
  component: SelectDistributionDateInput,
} as Meta<typeof SelectDistributionDateInput>;

export const Default: StoryObj<SelectDistributionDateInputProps> = {
  args: {
    title: "Start Date",
    date: {
      year: 2023,
      month: 10,
      date: 1
    },
    setDate: action("date")
  },
};