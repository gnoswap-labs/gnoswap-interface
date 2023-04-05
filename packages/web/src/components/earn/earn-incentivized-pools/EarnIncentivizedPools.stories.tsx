import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnIncentivizedPools from "./EarnIncentivizedPools";
import IncentivizedPoolCardListContainer from "@containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer";

export default {
  title: "earn/EarnIncentivizedPools",
  component: EarnIncentivizedPools,
} as ComponentMeta<typeof EarnIncentivizedPools>;

const Template: ComponentStory<typeof EarnIncentivizedPools> = args => (
  <EarnIncentivizedPools
    {...args}
    cardList={<IncentivizedPoolCardListContainer />}
  />
);

export const Default = Template.bind({});
Default.args = {};
