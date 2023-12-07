import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectPair from "./SelectPair";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "common/AddLiquidity/SelectPair",
  component: SelectPair,
} as ComponentMeta<typeof SelectPair>;

const Template: ComponentStory<typeof SelectPair> = args => (
  <SelectPair {...args} />
);

const tokenA: TokenModel = {
  chainId: "test3",
  address: "0x111111111117dC0aa78b770fA6A738034120C302",
  path: "gno.land/r/demo/1inch",
  name: "1inch",
  symbol: "1INCH",
  decimals: 6,
  logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
  type: "grc20",
  priceId: "1inch",
  createdAt: "1999-01-01T00:00:01Z"
};

const tokenB: TokenModel = {
  name: "Wrapped Ether",
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  path: "gno.land/r/demo/weth",
  symbol: "WETH",
  decimals: 6,
  chainId: "test3",
  type: "grc20",
  priceId: "weth",
  createdAt: "1999-01-01T00:00:02Z",
  isWrappedGasToken: true,
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png"
};

export const Default = Template.bind({});
Default.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
  disabled: true,
};
