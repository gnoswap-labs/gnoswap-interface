import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LoadMoreButton from "./LoadMoreButton";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/LoadMoreButton",
  component: LoadMoreButton,
} as ComponentMeta<typeof LoadMoreButton>;

const Template: ComponentStory<typeof LoadMoreButton> = args => (
  <LoadMoreButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  show: true,
  onClick: action("onClick"),
};
