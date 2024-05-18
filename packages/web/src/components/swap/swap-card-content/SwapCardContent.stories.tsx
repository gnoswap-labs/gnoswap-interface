import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardContent from "./SwapCardContent";
import { css } from "@emotion/react";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { action } from "@storybook/addon-actions";

const swapTokenInfo: SwapTokenInfo = {
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
    priceId: "gno.land/r/foo",
    address: ""
  },
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
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
    priceId: "gno.land/r/foo",
    address: ""
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
