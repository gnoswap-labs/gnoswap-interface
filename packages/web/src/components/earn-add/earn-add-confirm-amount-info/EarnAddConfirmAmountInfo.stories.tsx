import EarnAddConfirmAmountInfo, { type EarnAddConfirmAmountInfoProps } from "./EarnAddConfirmAmountInfo";
import { Meta, StoryObj } from "@storybook/react";


const token = {
  info: {
    tokenId: "1",
    name: "Gnoland",
    symbol: "GNO.LAND",
    tokenLogo: "",
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
    token0: token,
    token1: token,
    feeRate: "0.30%"
  },
};