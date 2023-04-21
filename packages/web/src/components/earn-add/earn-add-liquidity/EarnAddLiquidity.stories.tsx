import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnAddLiquidity from "./EarnAddLiquidity";
import { action } from "@storybook/addon-actions";

export default {
  title: "earn add/EarnAddLiquidity",
  component: EarnAddLiquidity,
} as ComponentMeta<typeof EarnAddLiquidity>;

const Template: ComponentStory<typeof EarnAddLiquidity> = args => (
  <EarnAddLiquidity {...args} />
);

export const Default = Template.bind({});
Default.args = {
  openFeeTier: true,
  onClickOpenFeeTier: action("onClickOpenFeeTier"),
  openPriceRange: true,
  onClickOpenPriceRange: action("onClickOpenPriceRange"),
};
