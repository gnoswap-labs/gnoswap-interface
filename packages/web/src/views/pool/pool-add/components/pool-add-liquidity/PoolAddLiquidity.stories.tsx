import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolAddLiquidity from "./PoolAddLiquidity";
import { action } from "@storybook/addon-actions";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "pool/pool-add/PoolAddLiquidity",
  component: PoolAddLiquidity,
} as ComponentMeta<typeof PoolAddLiquidity>;

const Template: ComponentStory<typeof PoolAddLiquidity> = args => (
  <PoolAddLiquidity {...args} />
);
const tokenA: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "grc20",
  priceID: "gno.land/r/gns",
};
const tokenB: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "grc20",
  priceID: "gno.land/r/gns",
};

export const Default = Template.bind({});
Default.args = {
  tokenA: tokenA,
  tokenB: tokenB,
  feeTiers: [],
  selectFeeTier: action("selectFeeTier"),
  priceRanges: [],
  changePriceRange: action("selectPriceRange"),
};
