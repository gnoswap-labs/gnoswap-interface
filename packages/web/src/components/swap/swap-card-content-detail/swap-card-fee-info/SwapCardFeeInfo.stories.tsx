import { css } from "@emotion/react";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SwapCardFeeInfo from "./SwapCardFeeInfo";

const createToken = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

const tokenA = createToken("GNOT");
const tokenB = createToken("GNS");

// 1000 GNOT -> 121.885688 GNS. The pools output 122.068791 GNS and the router keeps 0.183103 GNS of it.
const swapSummaryInfo: SwapSummaryInfo = {
  tokenA,
  tokenB,
  swapDirection: "EXACT_IN",
  swapRate: 0.121885688,
  swapRateUSD: 2437.71376,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 121.276259,
    currency: "GNS",
  },
  swapRateAction: SwapRateAction.ATOB,
  swapRate1USD: 20,
  protocolFee: "0.15%",
  // The quote's `feeAmount`: raw units of the output token (6 decimals), 1 GNS = $20
  routerFeeAmountRaw: "183103",
  tokenBPriceUSD: 20,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA,
  tokenAAmount: "1000",
  tokenABalance: "5000",
  tokenAUSD: 2450,
  tokenAUSDStr: "$2,450",
  tokenAPriceGrade: "NONE",
  tokenB,
  tokenBAmount: "121.885688",
  tokenBBalance: "0",
  tokenBUSD: 2437.71376,
  tokenBUSDStr: "$2,437.71",
  tokenBPriceGrade: "NONE",
  direction: "EXACT_IN",
  slippage: 0.5,
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
    isLoading: false,
    priceImpactStatus: "LOW",
  },
};

/** A fee of exactly zero reads as zero, not as a missing or rounded-down amount. */
export const ZeroFee: Story = {
  ...Default,
  args: {
    ...Default.args,
    swapSummaryInfo: { ...swapSummaryInfo, protocolFee: "0%", routerFeeAmountRaw: "0" },
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
