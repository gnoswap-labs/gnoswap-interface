import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TrendingCryptos from "./TrendingCryptos";
import TrendingCryptoCardListContainer from "../../containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";

export default {
  title: "token/TrendingCryptos",
  component: TrendingCryptos,
} as ComponentMeta<typeof TrendingCryptos>;

const Template: ComponentStory<typeof TrendingCryptos> = args => (
  <TrendingCryptos {...args} cardList={<TrendingCryptoCardListContainer />} />
);

export const Default = Template.bind({});
Default.args = {};
