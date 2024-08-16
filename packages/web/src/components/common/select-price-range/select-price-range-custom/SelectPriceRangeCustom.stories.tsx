import SelectPriceRangeCustom, { type SelectPriceRangeCustomProps } from "./SelectPriceRangeCustom";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/AddLiquidity/SelectPriceRangeCustom",
  component: SelectPriceRangeCustom,
} as Meta<typeof SelectPriceRangeCustom>;

export const Default: StoryObj<SelectPriceRangeCustomProps> = {
  args: {},
};