import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MyPositionCardList from "./MyPositionCardList";

export default {
  title: "common/MyPositionCardList",
  component: MyPositionCardList,
} as ComponentMeta<typeof MyPositionCardList>;

const Template: ComponentStory<typeof MyPositionCardList> = args => (
  <MyPositionCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {};
