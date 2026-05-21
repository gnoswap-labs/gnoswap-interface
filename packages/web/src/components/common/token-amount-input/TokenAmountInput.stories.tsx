import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { TokenModel } from "@models/token/token-model";
import TokenAmountInput from "./TokenAmountInput";

const meta = {
  title: "common/TokenAmountInput",
  component: TokenAmountInput,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenAmountInput>;

export default meta;
type Story = StoryObj<typeof TokenAmountInput>;

const token: TokenModel = {
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

export const Default: Story = {
  args: {
    token,
    amount: "12,211",
    balance: "12,211",
    usdValue: "12.3",
    changable: true,
    changeAmount: fn(),
    changeToken: fn(),
  },
};
