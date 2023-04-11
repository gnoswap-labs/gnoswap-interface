import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenInfoContent from "./TokenInfoContent";
import {
  marketInformationInit,
  performanceInit,
  priceInfomationInit,
} from "@containers/token-info-content-container/TokenInfoContentContainer";

export default {
  title: "token/TokenInfoContent",
  component: TokenInfoContent,
} as ComponentMeta<typeof TokenInfoContent>;

const Template: ComponentStory<typeof TokenInfoContent> = args => (
  <TokenInfoContent
    {...args}
    performance={performanceInit}
    priceInfo={priceInfomationInit}
    marketInfo={marketInformationInit}
  />
);

export const Default = Template.bind({});
Default.args = {};
