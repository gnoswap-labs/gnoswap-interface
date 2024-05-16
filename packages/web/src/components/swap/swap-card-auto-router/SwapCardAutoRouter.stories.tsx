import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardAutoRouter from "./SwapCardAutoRouter";
import { css } from "@emotion/react";
import { SwapRouteInfo } from "@models/swap/swap-route-info";

const swapRouteInfos: SwapRouteInfo[] = [{
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
