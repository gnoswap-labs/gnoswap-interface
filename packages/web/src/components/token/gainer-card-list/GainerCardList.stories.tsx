import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import GainerCardList from "./GainerCardList";
import { gainersInit } from "@containers/gainer-and-loser-container/GainerAndLoserContainer";

export default {
  title: "token/GainerCardList",
  component: GainerCardList,
} as ComponentMeta<typeof GainerCardList>;

const Template: ComponentStory<typeof GainerCardList> = args => (
  <GainerCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  gainers: gainersInit,
};
