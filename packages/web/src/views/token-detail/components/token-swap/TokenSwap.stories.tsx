import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenSwap from "./TokenSwap";
import { action } from "@storybook/addon-actions";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "token/TokenSwap",
  component: TokenSwap,
} as ComponentMeta<typeof TokenSwap>;

const Template: ComponentStory<typeof TokenSwap> = args => (
  <TokenSwap {...args} />
);

const TOKEN_A: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "grc20",
  priceID: "gno.land/r/gns",
};

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
  changeTokenA: action("changeTokenA"),
  changeTokenAAmount: action("changeTokenAAmount"),
  changeTokenB: action("changeTokenB"),
  changeTokenBAmount: action("changeTokenBAmount"),
  switchSwapDirection: action("switchSwapDirection"),
};
