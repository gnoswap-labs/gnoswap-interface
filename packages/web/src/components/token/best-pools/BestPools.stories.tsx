import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import BestPools from "./BestPools";

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
  cardList: [],
};
