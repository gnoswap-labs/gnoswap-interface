import { Meta, StoryObj } from "@storybook/react";

import PoolAddConfirmFeeInfo, { type EarnAddConfirmFeeInfoProps } from "./PoolAddConfirmFeeInfo";

export default {
  title: "pool/pool-add/PoolAddConfirmFeeInfo",
  component: PoolAddConfirmFeeInfo,
} as Meta<typeof PoolAddConfirmFeeInfo>;

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