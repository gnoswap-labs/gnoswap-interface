import { css } from "@emotion/react";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SwapCardContentDetail from "./SwapCardContentDetail";

const swapSummaryInfo: SwapSummaryInfo = {
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

const swapRouteInfos: SwapRouteInfo[] = [
  {
    from: {
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
    to: {
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
    gasFee: {
      amount: 0.000001,
      currency: "GNOT",
    },
    gasFeeUSD: 0.1,
    pools: [],
    version: "V1",
    weight: 100,
  },
];

const meta = {
  title: "swap/SwapCardContentDetail",
  component: SwapCardContentDetail,
  tags: ["autodocs"],
} satisfies Meta<typeof SwapCardContentDetail>;

export default meta;
type Story = StoryObj<typeof SwapCardContentDetail>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SwapCardContentDetail>) => (
    <div css={wrapper}>
      <div css={contentWrap}>
        <SwapCardContentDetail {...args} />
      </div>
    </div>
  ),
  args: {
    swapSummaryInfo,
    swapRouteInfos,
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
