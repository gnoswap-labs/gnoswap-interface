import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import IncentivizedPoolCardList from "./IncentivizedPoolCardList";
import { action } from "@storybook/addon-actions";
import POOLS from "@repositories/pool/mock/pools.json";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolModel } from "@models/pool/pool-model";

const pool = POOLS.pools[0] as PoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);


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
    <IncentivizedPoolCardList {...args} incentivizedPools={[cardInfo]} currentIndex={1} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  isFetched: true,
  routeItem: action("routeItem"),
  mobile: false,
  page: 1,
  width: 1440,
  showPagination: false,
};

const wrapper = css`
  padding: 1rem 0;
`;
