import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LoadMoreButton, { TEXT_TYPE } from "./LoadMoreButton";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/LoadMoreButton",
  component: LoadMoreButton,
} as ComponentMeta<typeof LoadMoreButton>;

const Template: ComponentStory<typeof LoadMoreButton> = args => (
  <LoadMoreButton {...args} />
);

export const LoadType = Template.bind({});
LoadType.args = {
  show: true,
  onClick: action("onClick"),
  text: TEXT_TYPE.LOAD,
};

export const ShowType = Template.bind({});
ShowType.args = {
  show: true,
  onClick: action("onClick"),
  text: TEXT_TYPE.SHOW,
};
