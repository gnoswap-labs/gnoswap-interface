import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectPriceRange from "./SelectPriceRange";
import { action } from "@storybook/addon-actions";
import { DUMMY_PRICE_RANGE_MAP } from "@containers/earn-add-liquidity-container/earn-add-liquidity-dummy";

export default {
  title: "common/AddLiquidity/SelectPriceRange",
  component: SelectPriceRange,
} as ComponentMeta<typeof SelectPriceRange>;

const Template: ComponentStory<typeof SelectPriceRange> = args => (
  <SelectPriceRange {...args} />
);

export const Default = Template.bind({});
Default.args = {
  priceRangeMap: DUMMY_PRICE_RANGE_MAP,
  priceRange: undefined,
  selectPriceRange: action("selectPriceRange"),
};
