import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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

export default {
  title: "earn/IncentivizedPoolCardList",
  component: IncentivizedPoolCardList,
  argTypes: {
    isFetched: {
      options: [true, false],
      control: { type: "boolean" },
    },
  },
} as ComponentMeta<typeof IncentivizedPoolCardList>;

const Template: ComponentStory<typeof IncentivizedPoolCardList> = args => (
  <div css={wrapper}>
    <IncentivizedPoolCardList {...args} incentivizedPools={[cardInfoWithPriceGrade]} currentIndex={1} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  isPoolFetched: true,
  routeItem: action("routeItem"),
  mobile: false,
  page: 1,
  width: 1440,
  showPagination: false,
};

const wrapper = css`
  padding: 1rem 0;
`;
