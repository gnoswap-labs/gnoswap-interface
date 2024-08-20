import PoolAddConfirmPriceRangeInfo, { type PoolAddConfirmPriceRangeInfoProps } from "./PoolAddConfirmPriceRangeInfo";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "pool/pool-add/PoolAddConfirmPriceRangeInfo",
  component: PoolAddConfirmPriceRangeInfo,
} as Meta<typeof PoolAddConfirmPriceRangeInfo>;

const priceRangeInfo = {
  minPrice: "123",
  maxPrice: "123",
  priceLabel: "GNOS per ETH",
  currentPrice: "11 ETH per GNOT",
  feeBoost: "x10.23",
  estimatedAPR: "N/A",
};

export const Default: StoryObj<PoolAddConfirmPriceRangeInfoProps> = {
  args: { ...priceRangeInfo },
};