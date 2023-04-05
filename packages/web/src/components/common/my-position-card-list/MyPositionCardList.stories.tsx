import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MyPositionCardList from "./MyPositionCardList";
import { dummyPositionList } from "@containers/my-position-card-list-container/MyPositionCardListContainer";

export default {
  title: "common/MyPositionCardList",
  component: MyPositionCardList,
} as ComponentMeta<typeof MyPositionCardList>;

const Template: ComponentStory<typeof MyPositionCardList> = args => (
  <MyPositionCardList {...args} list={dummyPositionList} />
);

export const Default = Template.bind({});
Default.args = {};
