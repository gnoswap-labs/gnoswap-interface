import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IncentivizedPoolCard from "./IncentivizedPoolCard";
import { poolDummy } from "./incentivized-pool-dummy";

export default {
  title: "earn/IncentivizedPoolCard",
  component: IncentivizedPoolCard,
} as ComponentMeta<typeof IncentivizedPoolCard>;

const Template: ComponentStory<typeof IncentivizedPoolCard> = args => {
  return <IncentivizedPoolCard {...args} item={poolDummy[0]} />;
};

export const Default = Template.bind({});
Default.args = {};
