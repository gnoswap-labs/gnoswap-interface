import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCard from "./SwapCard";
import { css } from "@emotion/react";
import {
  coinList,
  dummyAutoRouterInfo,
  dummySwapGasInfo,
} from "@containers/swap-container/SwapContainer";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

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
  search: action("search"),
  keyword: "",
  gnosAmount: "1500",
  isConnected: true,
  autoRouter: true,
  showAutoRouter: action("onClick"),
  swapGasInfo: dummySwapGasInfo,
  swapInfo: true,
  showSwapInfo: action("onClick"),
  autoRouterInfo: dummyAutoRouterInfo,
  settingMenuToggle: true,
  onSettingMenu: action("onSettingMenu"),
  tolerance: "",
  changeTolerance: action("changeTolerance"),
  tokenModal: true,
  onSelectTokenModal: action("onClick"),
  swapOpen: true,
  onConfirmModal: action("onClick"),
  submitSwap: action("submitSwap"),
  coinList: coinList(),
  changeToken: action("changeToken"),
  selectToken: action("selectToken"),
  resetTolerance: action("resetTolerance"),
  handleCopyClipBoard: action("handleCopyClipBoard"),
  breakpoint: DEVICE_TYPE.WEB,
  submit: false,
  copied: true,
  isFetching: true,
  swapResult: { success: true, transaction: "https//:naver.com" },
  from: {
    token: "USDCoin",
    symbol: "USDC",
    amount: "121",
    price: "$0.00",
    gnosExchangePrice: "1250",
    usdExchangePrice: "($1541.55)",
    balance: "0",
    logoURI:
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
    logoURI:
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
