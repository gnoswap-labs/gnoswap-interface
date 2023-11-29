import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardContent from "./SwapCardContent";
import { css } from "@emotion/react";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { action } from "@storybook/addon-actions";

const swapTokenInfo: SwapTokenInfo = {
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
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
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
  tokenBAmount: "",
  tokenBBalance: "",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: "10"
};

export default {
  title: "swap/SwapCardContent",
  component: SwapCardContent,
} as ComponentMeta<typeof SwapCardContent>;

const Template: ComponentStory<typeof SwapCardContent> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SwapCardContent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  swapTokenInfo,
  swapSummaryInfo: null,
  swapRouteInfos: [],
  changeTokenA: action("changeTokenA"),
  changeTokenAAmount: action("changeTokenAAmount"),
  changeTokenB: action("changeTokenB"),
  changeTokenBAmount: action("changeTokenBAmount"),
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
