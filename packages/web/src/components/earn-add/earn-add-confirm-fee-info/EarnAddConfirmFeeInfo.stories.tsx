import EarnAddConfirmFeeInfo, { type EarnAddConfirmFeeInfoProps } from "./EarnAddConfirmFeeInfo";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "earn-add/EarnAddConfirmFeeInfo",
  component: EarnAddConfirmFeeInfo,
} as Meta<typeof EarnAddConfirmFeeInfo>;

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

const feeInfo = {
  token: token.info,
  fee: "-500",
};

export const Default: StoryObj<EarnAddConfirmFeeInfoProps> = {
  args: { ...feeInfo },
};