import { ComponentStory, ComponentMeta } from "@storybook/react";
import EarnIncentivizedPools from "./EarnIncentivizedPools";
import IncentivizedPoolCardList from "../incentivized-pool-card-list/IncentivizedPoolCardList";
import { poolDummy } from "../incentivized-pool-card-list/incentivized-pool-dummy";
import { action } from '@storybook/addon-actions';

export default {
  title: "earn/EarnIncentivizedPools",
  component: EarnIncentivizedPools,
} as ComponentMeta<typeof EarnIncentivizedPools>;

const Template: ComponentStory<typeof EarnIncentivizedPools> = args => (
  <EarnIncentivizedPools
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  cardList: <IncentivizedPoolCardList
    currentIndex={1}
    list={poolDummy}
    isFetched={true}
    routeItem={action("routeItem")}
    mobile={false}
  />
};
