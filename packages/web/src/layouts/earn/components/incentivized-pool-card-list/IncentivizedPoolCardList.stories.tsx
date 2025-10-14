import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { IncentivizePoolModel } from "@models/pool/pool-model";
import POOLS from "@repositories/pool/mock/pools.json";
import { IncentivizePoolCardInfoWithPriceGrade } from "@models/pool/info/pool-card-info";

import IncentivizedPoolCardList from "./IncentivizedPoolCardList";

const pool = POOLS.pools[0] as unknown as IncentivizePoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);
const cardInfoWithPriceGrade: IncentivizePoolCardInfoWithPriceGrade = {
  ...cardInfo,
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
};

const meta = {
  title: "earn/IncentivizedPoolCardList",
  component: IncentivizedPoolCardList,
  tags: ["autodocs"],
  argTypes: {
    isPoolFetched: {
      control: "boolean",
      description: "풀 데이터 로딩 완료 여부",
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IncentivizedPoolCardList>;

export default meta;
type Story = StoryObj<typeof IncentivizedPoolCardList>;

export const Default: Story = {
  args: {
    incentivizedPools: [cardInfoWithPriceGrade],
    currentIndex: 1,
    isPoolFetched: true,
    routeItem: fn(),
    mobile: false,
    page: 1,
    width: 1440,
    showPagination: false,
  },
};

const wrapper = css`
  padding: 1rem 0;
`;
