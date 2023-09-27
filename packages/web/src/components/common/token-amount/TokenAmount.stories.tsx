import TokenAmount, { type TokenAmountProps } from "./TokenAmount";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/TokenAmount",
  component: TokenAmount,
} as Meta<typeof TokenAmount>;

const token = {
  path: "1",
  name: "Gnoland",
  symbol: "GNO.LAND",
  logoURI: "",
};

export const Default: StoryObj<TokenAmountProps> = {
  args: {
    token,
    amount: "12,211",
    usdPrice: "$12.3",
  },
};