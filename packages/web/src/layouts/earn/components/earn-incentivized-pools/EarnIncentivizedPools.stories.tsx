import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { RefObject } from "react";

import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { IncentivizePoolModel } from "@models/pool/pool-model";
import POOLS from "@repositories/pool/mock/pools.json";
import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";

import IncentivizedPoolCardList from "../incentivized-pool-card-list/IncentivizedPoolCardList";
import EarnIncentivizedPools from "./EarnIncentivizedPools";

const pool = POOLS.pools[0] as unknown as IncentivizePoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);
const cardInfoWithPriceGrade: IncentivizePoolCardInfoWithPriceGrade = {
  ...cardInfo,
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
};

const meta = {
  title: "earn/EarnIncentivizedPools",
  component: EarnIncentivizedPools,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnIncentivizedPools>;

export default meta;
type Story = StoryObj<typeof EarnIncentivizedPools>;

export const Default: Story = {
  args: {
    cardList: (
      <IncentivizedPoolCardList
        currentIndex={1}
        incentivizedPools={[cardInfoWithPriceGrade]}
        isPoolFetched={true}
        routeItem={fn()}
        mobile={false}
        loadMore={false}
        page={1}
        themeKey="dark"
        divRef={null as unknown as RefObject<HTMLDivElement>}
        onScroll={fn()}
        width={1440}
        showPagination={false}
        isLoading={false}
      />
    ),
  },
};
