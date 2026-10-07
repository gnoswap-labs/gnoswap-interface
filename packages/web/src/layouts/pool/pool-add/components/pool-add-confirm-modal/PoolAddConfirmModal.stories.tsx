import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { TokenModel } from "@models/token/token-model";

import PoolAddConfirmModal from "./PoolAddConfirmModal";

const meta = {
  title: "pool/pool-add/PoolAddConfirmModal",
  component: PoolAddConfirmModal,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof PoolAddConfirmModal>;

export default meta;
type Story = StoryObj<typeof PoolAddConfirmModal>;

const tokenA: {
  info: TokenModel;
  amount: string;
  usdPrice: string;
} = {
  info: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
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
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
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
  feeRate: "0.30%",
};

const priceRangeInfo = {
  minPrice: "123",
  maxPrice: "123",
  inRange: true,
  priceLabelMin: "GNOS per ETH",
  priceLabelMax: "GNOS per ETH",
  currentPrice: "11 ETH per GNOT",
  feeBoost: "x10.23",
  estimatedAPR: "N/A",
};

const feeInfo = {
  token: tokenA.info,
  fee: "-500",
};

export const Default: Story = {
  args: {
    amountInfo,
    priceRangeInfo,
    feeInfo,
    confirm: fn(),
    close: fn(),
  },
};
