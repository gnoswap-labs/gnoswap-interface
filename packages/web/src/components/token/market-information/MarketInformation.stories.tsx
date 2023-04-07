import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MarketInformation from "./MarketInformation";
import { marketInformationInit } from "@containers/token-info-content-container/TokenInfoContentContainer";

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
