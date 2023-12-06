import SelectPriceRangeCutomController, { type SelectPriceRangeCutomControllerProps } from "./SelectPriceRangeCutomController";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/AddLiquidity/SelectPriceRangeCutomController",
  component: SelectPriceRangeCutomController,
} as Meta<typeof SelectPriceRangeCutomController>;

export const Default: StoryObj<SelectPriceRangeCutomControllerProps> = {
  args: {
    current: 123123,
    title: "GNOS per GNOT"
  },
};