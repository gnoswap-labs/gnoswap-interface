import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { TokenModel } from "@models/token/token-model";

import EnterAmounts from "./LiquidityEnterAmounts";

const meta = {
  title: "pool/pool-add/EnterAmounts",
  component: EnterAmounts,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof EnterAmounts>;

export default meta;
type Story = StoryObj<typeof EnterAmounts>;

const token: TokenModel = {
  isWrappedGasToken: false,
  isGasToken: false,
  description: "",
  websiteURL: "",
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  tokenId: "gno.land/r/foo.FOO",
  decimals: 4,
  symbol: "FOO",
  displaySymbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: "",
};

export const Default: Story = {
  args: {
    tokenAInput: {
      token: token,
      amount: "121",
      usdValue: "$0.00",
      balance: "0",
      changeAmount: fn(),
      delegateButtonState: "DELEGATE",
      delegateButtonText: "Delegate GNS",
      isAvailableDelegate: true,
    },
    tokenBInput: {
      token: token,
      amount: "121",
      usdValue: "$0.00",
      balance: "0",
      changeAmount: fn(),
      delegateButtonState: "DELEGATE",
      delegateButtonText: "Delegate GNS",
      isAvailableDelegate: true,
    },
    changeTokenA: fn(),
    changeTokenB: fn(),
  },
};
