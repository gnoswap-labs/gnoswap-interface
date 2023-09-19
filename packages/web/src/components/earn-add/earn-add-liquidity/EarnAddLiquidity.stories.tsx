import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnAddLiquidity from "./EarnAddLiquidity";
import { action } from "@storybook/addon-actions";
import { DUMMY_FEE_TIERS, DUMMY_POOL_TICKS, DUMMY_PRICE_RANGE_MAP } from "@containers/earn-add-liquidity-container/earn-add-liquidity-dummy";

export default {
  title: "earn-add/EarnAddLiquidity",
  component: EarnAddLiquidity,
} as ComponentMeta<typeof EarnAddLiquidity>;

const Template: ComponentStory<typeof EarnAddLiquidity> = args => (
  <EarnAddLiquidity {...args} />
);
const token0 = {
  tokenId: "1",
  tokenLogo: "",
  name: "Bitcoin",
  symbol: "BTC",
};
const token1 = {
  tokenId: "2",
  tokenLogo: "",
  name: "Ethereum",
  symbol: "ETH",
};

export const Default = Template.bind({});
Default.args = {
  mode: "POOL",
  token0: token0,
  token1: token1,
  feeTiers: DUMMY_FEE_TIERS,
  feeRate: "0.01",
  selectFeeTier: action("selectFeeTier"),
  priceRangeMap: DUMMY_PRICE_RANGE_MAP,
  priceRange: "Custom",
  selectPriceRange: action("selectPriceRange"),
  ticks: DUMMY_POOL_TICKS,
  currentTick: DUMMY_POOL_TICKS[20],
};
