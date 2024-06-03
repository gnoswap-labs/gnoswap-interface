import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolIncentivizeDetails from "./PoolIncentivizeDetails";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";

export default {
  title: "incentivize/PoolIncentivizeDetails",
  component: PoolIncentivizeDetails,
} as ComponentMeta<typeof PoolIncentivizeDetails>;

const Template: ComponentStory<typeof PoolIncentivizeDetails> = args => (
  <PoolIncentivizeDetails {...args} />
);

const poolDetail = PoolDetailData.pool;

export const Default = Template.bind({});
Default.args = {
  details: poolDetail as any,
};
