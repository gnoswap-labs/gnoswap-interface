import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IncentivizedPoolCard from "./IncentivizedPoolCard";
import { action } from "@storybook/addon-actions";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";

const pool: PoolCardInfo = {
  poolId: "bar_foo_500",
  tokenA: {
    chainId: "dev",
    createdAt: "2023-10-12T06:56:10+09:00",
    name: "Bar",
    address: "g1w8wqgrp08cqhtupzx98n4jtm8kqy7vadfmmyd0",
    path: "gno.land/r/bar",
    decimals: 4,
    symbol: "BAR",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/bar"
  },
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-12T06:56:08+09:00",
    name: "Foo",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/foo"
  },
  feeTier: "FEE_500",
  liquidity: "$1,182,797",
  apr: "0.12%",
  volume24h: "$1,182,797",
  fees24h: "$131.937491",
  rewards: [
    {
      token: {
        chainId: "dev",
        createdAt: "2023-10-12T06:56:12+09:00",
        name: "Gnoswap",
        address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
        path: "gno.land/r/gnos",
        decimals: 4,
        symbol: "GNOS",
        logoURI: "/gnos.svg",
        priceId: "gno.land/r/gnos"
      },
      amount: 10
    }
  ],
  incentiveType: "Incentivized",
  tickInfo: {
    currentTick: 1.498590,
    ticks: []
  }
};

export default {
  title: "earn/IncentivizedPoolCard",
  component: IncentivizedPoolCard,
} as ComponentMeta<typeof IncentivizedPoolCard>;

const Template: ComponentStory<typeof IncentivizedPoolCard> = args => {
  return <IncentivizedPoolCard {...args} pool={pool} />;
};

export const Default = Template.bind({});
Default.args = {
  routeItem: action("routeItem"),
};
