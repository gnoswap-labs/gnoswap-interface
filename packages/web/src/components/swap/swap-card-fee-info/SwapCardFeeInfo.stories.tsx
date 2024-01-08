import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardFeeInfo from "./SwapCardFeeInfo";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";

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
    priceId: "gno.land/r/foo",
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
    priceId: "gno.land/r/foo",
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
  openedRouteInfo: true,
  toggleRouteInfo: action("toggleRouteInfo"),
  swapSummaryInfo
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
