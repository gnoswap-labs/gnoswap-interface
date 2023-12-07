import TokenAmount, { type TokenAmountProps } from "./TokenAmount";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/TokenAmount",
  component: TokenAmount,
} as Meta<typeof TokenAmount>;

const token = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  type: "grc20",
  priceId: "gno.land/r/gnos"
};

export const Default: StoryObj<TokenAmountProps> = {
  args: {
    token,
    amount: "12,211",
    usdPrice: "$12.3",
  },
};