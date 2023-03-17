import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CardList from "./CardList";

export default {
  title: "home/CardList",
  component: CardList,
} as ComponentMeta<typeof CardList>;

const Template: ComponentStory<typeof CardList> = args => (
  <CardList {...args} />
);

export const Default = Template.bind({});
Default.args = {};
