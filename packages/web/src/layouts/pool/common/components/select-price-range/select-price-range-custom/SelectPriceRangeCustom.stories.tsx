import SelectPriceRangeCustom, { type SelectPriceRangeCustomProps } from "./SelectPriceRangeCustom";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  title: "common/AddLiquidity/SelectPriceRangeCustom",
  component: SelectPriceRangeCustom,
} as Meta<typeof SelectPriceRangeCustom>;

export const Default: StoryObj<SelectPriceRangeCustomProps> = {
  args: {},
};
