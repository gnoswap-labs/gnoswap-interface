import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import HomeSwap from "./HomeSwap";
import { action } from "@storybook/addon-actions";

export default {
  title: "home/HomeSwap",
  component: HomeSwap,
} as ComponentMeta<typeof HomeSwap>;

const Template: ComponentStory<typeof HomeSwap> = args => (
  <HomeSwap {...args} />
);

export const Default = Template.bind({});
Default.args = {
  swapTokenInfo: {
    tokenA: {
      chainId: "dev",
      createdAt: "2023-10-17T05:58:00+09:00",
      name: "Foo",
      address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
      path: "gno.land/r/foo",
      decimals: 4,
      symbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      type: "grc20",
      priceID: "gno.land/r/foo",
    },
    tokenAAmount: "0",
    tokenABalance: "0",
    tokenAUSD: 0,
    tokenAUSDStr: "0",
    tokenB: {
      chainId: "dev",
      createdAt: "2023-10-17T05:58:00+09:00",
      name: "Foo",
      address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
      path: "gno.land/r/foo",
      decimals: 4,
      symbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      type: "grc20",
      priceID: "gno.land/r/foo",
    },
    tokenBAmount: "0",
    tokenBBalance: "0",
    tokenBUSD: 0,
    tokenBUSDStr: "0",
    direction: "EXACT_IN",
    slippage: "0",
  },
  swapNow: action("swapNow"),
};
