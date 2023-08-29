import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MyPositionCard from "./MyPositionCard";
import { dummyPositionList } from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/MyPositionCard",
  component: MyPositionCard,
} as ComponentMeta<typeof MyPositionCard>;

const Template: ComponentStory<typeof MyPositionCard> = args => (
  <MyPositionCard {...args} />
);

export const Staked = Template.bind({});
Staked.args = {
  item: dummyPositionList[1],
};

export const Unstaked = Template.bind({});
Unstaked.args = {
  item: dummyPositionList[0],
  routeItem: action("routeItem"),
};
