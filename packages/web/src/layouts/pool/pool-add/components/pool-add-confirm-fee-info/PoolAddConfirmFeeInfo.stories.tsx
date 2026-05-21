import { Meta, StoryObj } from "@storybook/nextjs";

import PoolAddConfirmFeeInfo, { type EarnAddConfirmFeeInfoProps } from "./PoolAddConfirmFeeInfo";

export default {
  title: "pool/pool-add/PoolAddConfirmFeeInfo",
  component: PoolAddConfirmFeeInfo,
} as Meta<typeof PoolAddConfirmFeeInfo>;

const token = {
  info: {
    path: "1",
    tokenId: "1.GNO.LAND",
    name: "gno.land",
    symbol: "GNO.LAND",
    displaySymbol: "GNO.LAND",
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
