import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectPriceRange from "./SelectPriceRangeReposition";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/AddLiquidity/SelectPriceRange",
  component: SelectPriceRange,
} as ComponentMeta<typeof SelectPriceRange>;

const Template: ComponentStory<typeof SelectPriceRange> = args => (
  <SelectPriceRange {...args} />
);

export const Default = Template.bind({});
Default.args = {
  priceRanges: [],
  priceRange: undefined,
  changePriceRange: action("changePriceRange"),
};
