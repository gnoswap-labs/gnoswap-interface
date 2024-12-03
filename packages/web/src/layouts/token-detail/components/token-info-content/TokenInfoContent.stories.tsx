import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenInfoContent from "./TokenInfoContent";
import { marketInformationInit } from "./market-information/market-information-list/MarketInformationList";
import { performanceInit } from "./price-performance/price-performance-list/PricePerformanceList";
import { priceInfomationInit } from "./price-information/price-information-list/PriceInformationList";

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
