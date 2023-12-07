import { action } from "@storybook/addon-actions";
import EarnAddConfirm, { type EarnAddConfirmProps } from "./EarnAddConfirm";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "earn-add/EarnAddConfirm",
  component: EarnAddConfirm,
} as Meta<typeof EarnAddConfirm>;


const tokenA = {
  info: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const tokenB = {
  info: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const amountInfo = {
  tokenA: tokenA,
  tokenAAmount: "123",
  tokenAUSDPrice: "1234",
  tokenB: tokenB,
  tokenBAmount: "123",
  tokenBUSDPrice: "1234",
  feeRate: "0.30%"
};

const priceRangeInfo = {
  minPrice: "123",
  maxPrice: "123",
  priceLabel: "GNOS per ETH",
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