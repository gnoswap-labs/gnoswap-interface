import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TrendingCryptoCard from "./TrendingCryptoCard";
import { trendingCryptoListInit } from "@containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";

export default {
  title: "token/TrendingCryptoCard",
  component: TrendingCryptoCard,
} as ComponentMeta<typeof TrendingCryptoCard>;

const Template: ComponentStory<typeof TrendingCryptoCard> = args => (
  <TrendingCryptoCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  item: trendingCryptoListInit[0],
};
