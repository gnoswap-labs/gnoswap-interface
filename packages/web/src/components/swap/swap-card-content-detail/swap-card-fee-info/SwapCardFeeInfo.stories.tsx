import { css } from "@emotion/react";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SwapCardFeeInfo from "./SwapCardFeeInfo";

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "GNOT",
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT",
  },
  gasFeeUSD: 0.1,
  swapRateAction: SwapRateAction.ATOB,
  swapRate1USD: 1,
  protocolFee: "0%",
  routerFee: 0.15,
  gasEstimateSuccess: true,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    chainId: "dev",
    createdAt: "2023-10-17T05:58:00+09:00",
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
};

const meta = {
  title: "swap/SwapCardFeeInfo",
  component: SwapCardFeeInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof SwapCardFeeInfo>;

export default meta;
type Story = StoryObj<typeof SwapCardFeeInfo>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SwapCardFeeInfo>) => (
    <div css={wrapper}>
      <div css={contentWrap}>
        <SwapCardFeeInfo {...args} />
      </div>
    </div>
  ),
  args: {
    swapSummaryInfo,
    swapTokenInfo,
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
