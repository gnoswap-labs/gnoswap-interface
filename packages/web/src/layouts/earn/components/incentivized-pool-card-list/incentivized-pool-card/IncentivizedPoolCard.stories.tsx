import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { IncentivizePoolModel } from "@models/pool/pool-model";
import POOLS from "@repositories/pool/mock/pools.json";
import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";

import IncentivizedPoolCard from "./IncentivizedPoolCard";

const pool = POOLS.pools[0] as unknown as IncentivizePoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);
const cardInfoWithPriceGrade: IncentivizePoolCardInfoWithPriceGrade = {
  ...cardInfo,
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
};

const meta = {
  title: "earn/IncentivizedPoolCard",
  component: IncentivizedPoolCard,
  tags: ["autodocs"],
} satisfies Meta<typeof IncentivizedPoolCard>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof IncentivizedPoolCard>]?: React.ComponentProps<typeof IncentivizedPoolCard>[K];
}>;

export const Default: Story = {
  args: {
    pool: cardInfoWithPriceGrade,
    routeItem: fn(),
  },
};
