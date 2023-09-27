import { action } from "@storybook/addon-actions";
import EarnAddConfirm, { type EarnAddConfirmProps } from "./EarnAddConfirm";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "earn-add/EarnAddConfirm",
  component: EarnAddConfirm,
} as Meta<typeof EarnAddConfirm>;

const tokenA = {
  info: {
    path: "1",
    name: "Gnoland",
    symbol: "GNOT",
    logoURI: "",
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const tokenB = {
  info: {
    path: "2",
    name: "Ether",
    symbol: "ETH",
    logoURI: "",
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const amountInfo = {
  tokenA: tokenA,
  tokenB: tokenB,
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
  token: tokenA.info,
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