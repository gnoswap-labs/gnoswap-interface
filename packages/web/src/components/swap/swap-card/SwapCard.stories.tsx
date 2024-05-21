import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCard from "./SwapCard";
import { css } from "@emotion/react";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapRouteInfo } from "@models/swap/swap-route-info";


const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  tokenB: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "GNOT"
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT"
  },
  gasFeeUSD: 0.1,
  swapRateAction: "ATOB",
  swapRate1USD: 1,
};

export const swapRouteInfos: SwapRouteInfo[] = [{
  from: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  to: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT"
  },
  gasFeeUSD: 0.1,
  pools: [],
  version: "V1",
  weight: 100,
}];

export default {
  title: "swap/SwapCard",
  component: SwapCard,
} as ComponentMeta<typeof SwapCard>;

const Template: ComponentStory<typeof SwapCard> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SwapCard {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  swapSummaryInfo,
  swapRouteInfos,
  swapButtonText: "Swap"
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
