import { action } from "@storybook/addon-actions";
import EarnAddConfirm, { type EarnAddConfirmProps } from "./EarnAddConfirm";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "earn-add/EarnAddConfirm",
  component: EarnAddConfirm,
} as Meta<typeof EarnAddConfirm>;

const token0 = {
  info: {
    tokenId: "1",
    name: "Gnoland",
    symbol: "GNOT",
    tokenLogo: "",
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const token1 = {
  info: {
    tokenId: "2",
    name: "Ether",
    symbol: "ETH",
    tokenLogo: "",
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const amountInfo = {
  token0: token0,
  token1: token1,
  feeRate: "0.30%"
};

const priceRangeInfo = {
  minPrice: "123",
  minPriceLable: "GNOS per ETH",
  maxPrice: "123",
  maxPriceLable: "GNOS per ETH",
  currentPrice: "11 ETH per GNOT",
  feeBoost: "x10.23",
  estimatedAPR: "N/A",
};

const feeInfo = {
  token: token0.info,
  fee: "-500",
};

export const Default: StoryObj<EarnAddConfirmProps> = {
  args: {
    amountInfo,
    priceRangeInfo,
    feeInfo,
    confirm: action("confirm"),
    close: action("close"),
  },
};