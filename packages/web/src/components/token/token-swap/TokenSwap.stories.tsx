import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenSwap from "./TokenSwap";
import { action } from "@storybook/addon-actions";

export default {
  title: "token/TokenSwap",
  component: TokenSwap,
} as ComponentMeta<typeof TokenSwap>;

const Template: ComponentStory<typeof TokenSwap> = args => (
  <TokenSwap {...args} />
);

const TOKEN_A = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  priceId: "gno.land/r/gnos",
}

export const Default = Template.bind({});
Default.args = {
  isSwitchNetwork: false,
  connected: false,
  isAvailSwap: false,
  swapButtonText: "Swap",
  isLoading: false,
  copied: false,
  themeKey: "dark",
  dataTokenInfo: {
    tokenA: TOKEN_A,
    tokenAAmount: "2,000,000",
    tokenABalance: "0",
    tokenB: TOKEN_A,
    tokenBAmount: "2,000,000",
    tokenBBalance: "0",
    direction: "EXACT_IN",
    tokenAUSDStr: "123",
    tokenBUSDStr: "123",
  },
  swapSummaryInfo: null,
  swapRouteInfos: [],
  connectWallet: action("connectWallet"),
  swapNow: action("swapNow"),
  handleSetting: action("handleSetting"),
  handleCopied: action("handleCopied"),
  changeTokenA: action("changeTokenA") ,
  changeTokenAAmount: action("changeTokenAAmount") ,
  changeTokenB: action("changeTokenB") ,
  changeTokenBAmount: action("changeTokenBAmount") ,
  switchSwapDirection: action("switchSwapDirection") ,
};
