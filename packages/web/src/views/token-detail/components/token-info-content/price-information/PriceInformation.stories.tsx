import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PriceInformation from "./PriceInformation";
import { priceInfomationInit } from "./price-information-list/PriceInformationList";

export default {
  title: "token/PriceInformation",
  component: PriceInformation,
} as ComponentMeta<typeof PriceInformation>;

const Template: ComponentStory<typeof PriceInformation> = args => (
  <PriceInformation {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: priceInfomationInit,
};
