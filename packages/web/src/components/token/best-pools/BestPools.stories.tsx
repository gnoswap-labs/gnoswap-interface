import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import BestPools from "./BestPools";
import { bestPoolListInit } from "@containers/best-pools-container/BestPoolsContainer";

export default {
  title: "token/BestPools",
  component: BestPools,
} as ComponentMeta<typeof BestPools>;

const Template: ComponentStory<typeof BestPools> = args => (
  <BestPools {...args} />
);

export const Default = Template.bind({});
Default.args = {
  titleSymbol: "GNS",
  cardList: bestPoolListInit,
};
