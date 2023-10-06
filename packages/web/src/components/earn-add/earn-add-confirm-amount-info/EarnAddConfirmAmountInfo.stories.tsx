import EarnAddConfirmAmountInfo, { type EarnAddConfirmAmountInfoProps } from "./EarnAddConfirmAmountInfo";
import { Meta, StoryObj } from "@storybook/react";

const token = {
  info: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

export default {
  title: "earn-add/EarnAddConfirmAmountInfo",
  component: EarnAddConfirmAmountInfo,
} as Meta<typeof EarnAddConfirmAmountInfo>;

export const Default: StoryObj<EarnAddConfirmAmountInfoProps> = {
  args: {
    ...data
  },
};