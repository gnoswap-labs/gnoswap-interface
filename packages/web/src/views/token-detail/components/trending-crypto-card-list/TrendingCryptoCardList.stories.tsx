import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TrendingCryptoCardList from "./TrendingCryptoCardList";
import { trendingCryptoListInit } from "@views/token-detail/containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";

export default {
  title: "token/TrendingCryptoCardList",
  component: TrendingCryptoCardList,
} as ComponentMeta<typeof TrendingCryptoCardList>;

const Template: ComponentStory<typeof TrendingCryptoCardList> = args => (
  <TrendingCryptoCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: trendingCryptoListInit,
};
