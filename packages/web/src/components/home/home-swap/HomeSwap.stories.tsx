import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import HomeSwap from "./HomeSwap";

const meta = {
  title: "home/HomeSwap",
  component: HomeSwap,
  tags: ["autodocs"],
} satisfies Meta<typeof HomeSwap>;

export default meta;
type Story = StoryObj<typeof HomeSwap>;

export const Default: Story = {
  args: {
    swapTokenInfo: {
      tokenA: {
        chainId: "dev",
        createdAt: "2023-10-17T05:58:00+09:00",
        name: "Foo",
        address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
        path: "gno.land/r/foo",
        tokenId: "gno.land/r/foo.FOO",
        decimals: 4,
        symbol: "FOO",
        displaySymbol: "FOO",
        logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
        type: "GRC20",
        priceID: "gno.land/r/foo",
      },
      tokenAAmount: "0",
      tokenABalance: "0",
      tokenAUSD: 0,
      tokenAUSDStr: "0",
      tokenAPriceGrade: "NONE",
      tokenB: {
        chainId: "dev",
        createdAt: "2023-10-17T05:58:00+09:00",
        name: "Foo",
        address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
        path: "gno.land/r/foo",
        tokenId: "gno.land/r/foo.FOO",
        decimals: 4,
        symbol: "FOO",
        displaySymbol: "FOO",
        logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
        type: "GRC20",
        priceID: "gno.land/r/foo",
      },
      tokenBAmount: "0",
      tokenBBalance: "0",
      tokenBUSD: 0,
      tokenBUSDStr: "0",
      tokenBPriceGrade: "NONE",
      direction: "EXACT_IN",
      slippage: 0,
    },
    swapNow: fn(),
  },
};
