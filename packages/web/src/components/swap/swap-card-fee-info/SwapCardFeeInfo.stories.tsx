import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardFeeInfo from "./SwapCardFeeInfo";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenB: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
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
  swapRateAction: "ATOB",
  swapRate1USD: 1,
  protocolFee: "0%",
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
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "grc20",
    priceID: "gno.land/r/foo",
  },
  tokenAAmount: "0",
  tokenABalance: "0",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-17T05:58:00+09:00",
    name: "Foo",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "grc20",
    priceID: "gno.land/r/foo",
  },
  tokenBAmount: "0",
  tokenBBalance: "0",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: "0",
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
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "grc20",
    priceID: "gno.land/r/foo",
  },
  tokenAAmount: "0",
  tokenABalance: "0",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-17T05:58:00+09:00",
    name: "Foo",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "grc20",
    priceID: "gno.land/r/foo",
  },
  tokenBAmount: "0",
  tokenBBalance: "0",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: "0",
};

export default {
  title: "swap/SwapCardFeeInfo",
  component: SwapCardFeeInfo,
} as ComponentMeta<typeof SwapCardFeeInfo>;

const Template: ComponentStory<typeof SwapCardFeeInfo> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SwapCardFeeInfo {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  swapSummaryInfo,
  swapTokenInfo,
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
