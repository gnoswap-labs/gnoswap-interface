import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import ConfirmSwapModal from "./ConfirmSwapModal";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";

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
  direction: "EXACT_IN",
  slippage: 10
};

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

export default {
  title: "swap/ConfirmSwapModal",
  component: ConfirmSwapModal,
} as ComponentMeta<typeof ConfirmSwapModal>;

const Template: ComponentStory<typeof ConfirmSwapModal> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <ConfirmSwapModal {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  submitted: false,
  swapTokenInfo,
  swapSummaryInfo,
  swapResult: null,
  swap: action("swap"),
  close: action("close"),
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
