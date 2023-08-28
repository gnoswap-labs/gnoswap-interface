import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import ConfirmSwapModal from "./ConfirmSwapModal";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";
import { DEVICE_TYPE } from "@styles/media";

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
  onConfirmModal: action("onConfirmModal"),
  submitSwap: action("submitSwap"),
  swapGasInfo: dummySwapGasInfo,
  breakpoint: DEVICE_TYPE.WEB,
  tolerance: "5",
  submit: false,
  isFetching: true,
  from: {
    token: "USDCoin",
    symbol: "USDC",
    amount: "121",
    price: "$0.00",
    gnosExchangePrice: "1250",
    usdExchangePrice: "($1541.55)",
    balance: "0",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
  to: {
    token: "HEX",
    symbol: "HEX",
    amount: "5000",
    price: "$0.00",
    gnosExchangePrice: "1250",
    usdExchangePrice: "($1541.55)",
    balance: "0",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
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
