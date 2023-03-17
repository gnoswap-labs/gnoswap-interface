import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IncentivizedPoolCardList from "./IncentivizedPoolCardList";

export default {
  title: "earn/IncentivizedPoolCardList",
  component: IncentivizedPoolCardList,
} as ComponentMeta<typeof IncentivizedPoolCardList>;

const Template: ComponentStory<typeof IncentivizedPoolCardList> = args => (
  <IncentivizedPoolCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {};
