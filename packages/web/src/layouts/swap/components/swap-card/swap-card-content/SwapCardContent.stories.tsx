import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { SwapTokenInfo } from "@models/swap/swap-token-info";

import SwapCardContent from "./SwapCardContent";

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    tokenId: "gno.land/r/foo.FOO",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenAPriceGrade: "NONE",
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    tokenId: "gno.land/r/foo.FOO",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenBAmount: "",
  tokenBBalance: "",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  tokenBPriceGrade: "NONE",
  direction: "EXACT_IN",
  slippage: 10,
};

const meta = {
  title: "swap/SwapCardContent",
  component: SwapCardContent,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <div css={contentWrap}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SwapCardContent>;

export default meta;
type Story = StoryObj<typeof SwapCardContent>;

export const Default: Story = {
  args: {
    swapTokenInfo,
    swapSummaryInfo: null,
    swapRouteInfos: [],
    changeTokenA: fn(),
    changeTokenAAmount: fn(),
    changeTokenB: fn(),
    changeTokenBAmount: fn(),
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 500px;
`;
