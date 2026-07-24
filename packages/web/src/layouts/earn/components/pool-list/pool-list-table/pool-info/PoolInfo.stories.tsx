import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";
import PoolInfo from "./PoolInfo";

const pool: IncentivizePoolCardInfoWithPriceGrade = {
  poolId: "bar_foo_500",
  tokenA: {
    chainId: "dev",
    createdAt: "2023-10-12T06:56:10+09:00",
    name: "Bar",
    address: "g1w8wqgrp08cqhtupzx98n4jtm8kqy7vadfmmyd0",
    path: "gno.land/r/bar",
    decimals: 4,
    symbol: "BAR",
    displaySymbol: "BAR",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    type: "GRC20",
    priceID: "gno.land/r/bar",
  },
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-12T06:56:08+09:00",
    name: "Foo",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "GRC20",
    priceID: "gno.land/r/foo",
  },
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
  feeTier: "FEE_500",
  liquidity: "$1,182,797",
  apr: "0.12%",
  stakingApr: "0",
  volume24h: "$1,182,797",
  fees24h: "$131.937491",
  rewardTokens: [],
  incentivized: true,
  hasStakedPosition: false,
  currentTick: 0,
  price: 0,
  tvl: "0",
};

const meta = {
  title: "earn/PoolList/PoolInfo",
  component: PoolInfo,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PoolInfo>;

export default meta;
type Story = StoryObj<typeof PoolInfo>;

export const Default: Story = {
  args: {
    pool: { ...pool, tvl: "0" },
    routeItem: fn(),
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
