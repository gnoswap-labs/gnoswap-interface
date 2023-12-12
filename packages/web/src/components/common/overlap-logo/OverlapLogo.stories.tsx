import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import OverlapLogo from "./OverlapLogo";

export default {
  title: "common/OverlapLogo",
  component: OverlapLogo,
} as ComponentMeta<typeof OverlapLogo>;

const Template: ComponentStory<typeof OverlapLogo> = args => (
  <OverlapLogo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  logos: ["https://picsum.photos/id/7/36/36", "https://picsum.photos/id/101/36/36"],
  size: 36,
};
