import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import DoubleLogo from "./DoubleLogo";

export default {
  title: "common/DoubleLogo",
  component: DoubleLogo,
} as ComponentMeta<typeof DoubleLogo>;

const Template: ComponentStory<typeof DoubleLogo> = args => (
  <DoubleLogo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  left: "https://picsum.photos/id/7/36/36",
  right: "https://picsum.photos/id/101/36/36",
  size: 36,
  overlap: 8,
};
