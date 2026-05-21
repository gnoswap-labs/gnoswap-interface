import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { TokenModel } from "@models/token/token-model";

import TokenSwap from "./TokenSwap";

const TOKEN_A: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  tokenId: "gno.land/r/gns.GNS",
  decimals: 4,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "GRC20",
  priceID: "gno.land/r/gns",
};

const meta = {
  title: "token/TokenSwap",
  component: TokenSwap,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenSwap>;

export default meta;
type Story = StoryObj<typeof TokenSwap>;

export const Default: Story = {
  args: {
    isSwitchNetwork: false,
    connectedWallet: false,
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
    connectWallet: fn(),
    swapNow: fn(),
    handleSetting: fn(),
    handleCopied: fn(),
    changeTokenA: fn(),
    changeTokenAAmount: fn(),
    changeTokenB: fn(),
    changeTokenBAmount: fn(),
    switchSwapDirection: fn(),
  },
};
