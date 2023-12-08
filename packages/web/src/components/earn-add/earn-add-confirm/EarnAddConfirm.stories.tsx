import { action } from "@storybook/addon-actions";
import EarnAddConfirm, { type EarnAddConfirmProps } from "./EarnAddConfirm";
import { Meta, StoryObj } from "@storybook/react";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "earn-add/EarnAddConfirm",
  component: EarnAddConfirm,
} as Meta<typeof EarnAddConfirm>;


const tokenA: {
  info: TokenModel;
  amount: string;
  usdPrice: string;
} = {
  info: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceId: "gno.land/r/foo",
    address: ""
  },
  amount: "12,211",
  usdPrice: "$12.3",
};

const tokenB: {
  info: TokenModel;
  amount: string;
  usdPrice: string;
} = {
  info: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceId: "gno.land/r/foo",
    address: ""
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