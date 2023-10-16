import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCard from "./SwapCard";
import { css } from "@emotion/react";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import PoolData from "@repositories/pool/mock/pools.json";
import { SwapRouteInfo } from "@models/swap/swap-route-info";

const pools = PoolData.pools;

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
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
  gasFeeUSD: 0.1
};

const swapRouteInfos: SwapRouteInfo[] = [{
  from: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  to: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT"
  },
  gasFeeUSD: 0.1,
  pools,
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
