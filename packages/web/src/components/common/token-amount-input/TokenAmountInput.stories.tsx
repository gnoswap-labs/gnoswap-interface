import TokenAmountInput, { type TokenAmountInputProps } from "./TokenAmountInput";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "common/TokenAmountInput",
  component: TokenAmountInput,
} as Meta<typeof TokenAmountInput>;

const token: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "GNS",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  type: "grc20",
  priceID: "gno.land/r/gns"
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