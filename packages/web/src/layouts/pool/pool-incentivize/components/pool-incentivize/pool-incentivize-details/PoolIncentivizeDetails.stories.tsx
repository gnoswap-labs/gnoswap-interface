import type { Meta, StoryObj } from "@storybook/nextjs";

import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";

import PoolIncentivizeDetails from "./PoolIncentivizeDetails";

const poolDetail = PoolDetailData.pool;

const meta = {
  title: "incentivize/PoolIncentivizeDetails",
  component: PoolIncentivizeDetails,
  tags: ["autodocs"],
} satisfies Meta<typeof PoolIncentivizeDetails>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolIncentivizeDetails>]?: React.ComponentProps<
    typeof PoolIncentivizeDetails
  >[K];
}>;

export const Default: Story = {
  args: {
    details: poolDetail as unknown as PoolSelectItemInfo,
  },
};
