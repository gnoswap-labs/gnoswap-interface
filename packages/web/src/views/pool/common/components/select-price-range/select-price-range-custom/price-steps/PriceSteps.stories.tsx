import SelectPriceRangeCutomController, { type PriceStepsProps } from "./PriceSteps";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/AddLiquidity/PriceSteps",
  component: SelectPriceRangeCutomController,
} as Meta<typeof SelectPriceRangeCutomController>;

export const Default: StoryObj<PriceStepsProps> = {
  args: {
    current: 123123,
    title: "GNOS per GNOT"
  },
};