import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardAutoRouter from "./SwapCardAutoRouter";
import { css } from "@emotion/react";
import { SwapRouteInfo } from "@models/swap/swap-route-info";

const swapRouteInfos: SwapRouteInfo[] = [{
  from: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
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
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
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
  title: "swap/SwapCardAutoRouter",
  component: SwapCardAutoRouter,
} as ComponentMeta<typeof SwapCardAutoRouter>;

const Template: ComponentStory<typeof SwapCardAutoRouter> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SwapCardAutoRouter {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
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
