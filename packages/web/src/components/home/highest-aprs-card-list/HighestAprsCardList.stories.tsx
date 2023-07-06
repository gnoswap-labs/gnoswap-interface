import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import HighestAprsCardList from "./HighestAprsCardList";
import { highestList } from "@components/home/card-list/card-list-dummy";

export default {
  title: "home/HighestAprsCardList",
  component: HighestAprsCardList,
} as ComponentMeta<typeof HighestAprsCardList>;

const Template: ComponentStory<typeof HighestAprsCardList> = args => (
  <HighestAprsCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: highestList,
};
