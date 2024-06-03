import SelectPriceRangeCutomController, { type SelectPriceRangeCustomControllerProps } from "./SelectPriceRangeCutomController";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/AddLiquidity/SelectPriceRangeCutomController",
  component: SelectPriceRangeCutomController,
} as Meta<typeof SelectPriceRangeCutomController>;

export const Default: StoryObj<SelectPriceRangeCustomControllerProps> = {
  args: {
    current: 123123,
    title: "GNOS per GNOT"
  },
};