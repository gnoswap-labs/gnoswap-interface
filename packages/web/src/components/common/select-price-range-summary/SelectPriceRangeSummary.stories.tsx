import SelectPriceRangeSummary, { type SelectPriceRangeSummaryProps } from "./SelectPriceRangeSummary";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/AddLiquidity/SelectPriceRangeSummary",
  component: SelectPriceRangeSummary,
} as Meta<typeof SelectPriceRangeSummary>;

export const Default: StoryObj<SelectPriceRangeSummaryProps> = {
  args: {
    depositRatio: "40.2% ETH / 59.8% GNOS",
    feeBoost: "x10.23",
    estimatedApr: "19.22%",
  },
};