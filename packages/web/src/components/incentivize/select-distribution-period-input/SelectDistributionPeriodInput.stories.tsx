import SelectDistributionPeriodInput, { type SelectDistributionPeriodInputProps } from "./SelectDistributionPeriodInput";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "incentivize/SelectDistributionPeriodInput",
  component: SelectDistributionPeriodInput,
} as Meta<typeof SelectDistributionPeriodInput>;

const periods = [90, 120, 150, 180, 210, 240];

export const Default: StoryObj<SelectDistributionPeriodInputProps> = {
  args: {
    title: "Distribution Period",
    period: 90,
    periods,
    changePeriod: action("changePeriod")
  },
};