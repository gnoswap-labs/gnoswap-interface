import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import HomeSwap from "./HomeSwap";

export default {
  title: "home/HomeSwap",
  component: HomeSwap,
} as ComponentMeta<typeof HomeSwap>;

const Template: ComponentStory<typeof HomeSwap> = args => (
  <HomeSwap {...args} />
);

export const Default = Template.bind({});
Default.args = {};
