import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TrendingCardList from "./TrendingCardList";

export default {
  title: "home/TrendingCardList",
  component: TrendingCardList,
} as ComponentMeta<typeof TrendingCardList>;

const Template: ComponentStory<typeof TrendingCardList> = args => (
  <TrendingCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: [],
};
