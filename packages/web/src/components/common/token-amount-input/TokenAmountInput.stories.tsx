import TokenAmountInput, { type TokenAmountInputProps } from "./TokenAmountInput";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/TokenAmountInput",
  component: TokenAmountInput,
} as Meta<typeof TokenAmountInput>;

const token = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  priceId: "gno.land/r/gnos"
};

export const Default: StoryObj<TokenAmountInputProps> = {
  args: {
    token,
    amount: "12,211",
    balance: "12,211",
    usdValue: "12.3",
    changable: true,
    changeAmount: action("changeAmount"),
    changeToken: action("changeToken"),
  },
};