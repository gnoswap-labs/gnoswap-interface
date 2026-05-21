import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { TokenModel } from "@models/token/token-model";

import PoolAddLiquidity from "./PoolAddLiquidity";

const meta = {
  title: "pool/pool-add/PoolAddLiquidity",
  component: PoolAddLiquidity,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof PoolAddLiquidity>;

export default meta;
type Story = StoryObj<typeof PoolAddLiquidity>;

const tokenA: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  tokenId: "gno.land/r/gns.GNS",
  decimals: 4,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "GRC20",
  priceID: "gno.land/r/gns",
};

const tokenB: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  tokenId: "gno.land/r/gns.GNS",
  decimals: 4,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "GRC20",
  priceID: "gno.land/r/gns",
};

export const Default: Story = {
  args: {
    tokenA: tokenA,
    tokenB: tokenB,
    feeTiers: [],
    selectFeeTier: fn(),
    priceRanges: [],
    changePriceRange: fn(),
  },
};
