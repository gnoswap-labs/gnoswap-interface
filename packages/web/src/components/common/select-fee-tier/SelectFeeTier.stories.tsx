import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectFeeTier from "./SelectFeeTier";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/AddLiquidity/SelectFeeTier",
  component: SelectFeeTier,
} as ComponentMeta<typeof SelectFeeTier>;

const Template: ComponentStory<typeof SelectFeeTier> = args => (
  <SelectFeeTier {...args} />
);

const feeRateInit = [
  {
    feeRate: FEE_RATE_OPTION.FEE_01,
    desc: "Best for very stable pairs",
    selectedFeeRate: "12% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_05,
    desc: "Best for stable pairs",
    selectedFeeRate: "67% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_3,
    desc: "Best for most pairs",
    selectedFeeRate: "21% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_1,
    desc: "Best for exotic pairs",
    selectedFeeRate: "Not created",
  },
];

export const Default = Template.bind({});
Default.args = {
  active: true,
  openFeeTier: true,
  onClickOpenFeeTier: action("onClickOpenFeeTier"),
  data: feeRateInit,
};
