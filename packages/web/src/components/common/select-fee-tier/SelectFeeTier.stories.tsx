import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectFeeTier from "./SelectFeeTier";
import { action } from "@storybook/addon-actions";
import { DUMMY_FEE_TIERS } from "@containers/earn-add-liquidity-container/earn-add-liquidity-dummy";

export default {
  title: "common/AddLiquidity/SelectFeeTier",
  component: SelectFeeTier,
} as ComponentMeta<typeof SelectFeeTier>;

const Template: ComponentStory<typeof SelectFeeTier> = args => (
  <SelectFeeTier {...args} />
);

export const Default = Template.bind({});
Default.args = {
  feeTiers: DUMMY_FEE_TIERS,
  feeRate: "0.01",
  selectFeeTier: action("selectFeeTier"),
};
