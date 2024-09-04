import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MarketInformation from "./MarketInformation";
import { marketInformationInit } from "./market-information-list/MarketInformationList";

export default {
  title: "token/MarketInformation",
  component: MarketInformation,
} as ComponentMeta<typeof MarketInformation>;

const Template: ComponentStory<typeof MarketInformation> = args => (
  <MarketInformation {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: marketInformationInit,
};
