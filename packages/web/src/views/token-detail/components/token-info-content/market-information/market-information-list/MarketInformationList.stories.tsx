import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MarketInformationList, { marketInformationInit } from "./MarketInformationList";

export default {
  title: "token/MarketInformationList",
  component: MarketInformationList,
} as ComponentMeta<typeof MarketInformationList>;

const Template: ComponentStory<typeof MarketInformationList> = args => (
  <MarketInformationList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: marketInformationInit,
};
