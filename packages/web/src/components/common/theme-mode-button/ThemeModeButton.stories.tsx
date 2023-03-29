import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ThemeModeButton from "./ThemeModeButton";

export default {
  title: "common/ThemeModeButton",
  component: ThemeModeButton,
} as ComponentMeta<typeof ThemeModeButton>;

const Template: ComponentStory<typeof ThemeModeButton> = args => (
  <ThemeModeButton {...args} />
);

export const Default = Template.bind({});
Default.args = {};
