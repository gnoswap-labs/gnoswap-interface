import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PriceInformationList, { priceInfomationInit } from "./PriceInformationList";

export default {
  title: "token/PriceInformationList",
  component: PriceInformationList,
} as ComponentMeta<typeof PriceInformationList>;

const Template: ComponentStory<typeof PriceInformationList> = args => (
  <PriceInformationList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: priceInfomationInit,
};
