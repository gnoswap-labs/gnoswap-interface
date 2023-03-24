import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LoadMoreButton from "./LoadMoreButton";

export default {
  title: "common/LoadMoreButton",
  component: LoadMoreButton,
} as ComponentMeta<typeof LoadMoreButton>;

const Template: ComponentStory<typeof LoadMoreButton> = args => (
  <LoadMoreButton {...args} />
);

export const Default = Template.bind({});
Default.args = {};
