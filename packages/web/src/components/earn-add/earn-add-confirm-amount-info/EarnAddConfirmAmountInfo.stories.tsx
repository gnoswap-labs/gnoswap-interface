import EarnAddConfirmAmountInfo, { type EarnAddConfirmAmountInfoProps } from "./EarnAddConfirmAmountInfo";
import { Meta, StoryObj } from "@storybook/react";


const token = {
  info: {
    path: "1",
    name: "Gnoland",
    symbol: "GNO.LAND",
    logoURI: "",
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
    tokenA: token,
    tokenB: token,
    feeRate: "0.30%"
  },
};