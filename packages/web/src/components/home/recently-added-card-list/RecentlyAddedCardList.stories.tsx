import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import RecentlyAddedCardList from "./RecentlyAddedCardList";
import { recentlyList } from "@components/home/card-list/card-list-dummy";

export default {
  title: "home/RecentlyAddedCardList",
  component: RecentlyAddedCardList,
} as ComponentMeta<typeof RecentlyAddedCardList>;

const Template: ComponentStory<typeof RecentlyAddedCardList> = args => (
  <RecentlyAddedCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: recentlyList,
};
