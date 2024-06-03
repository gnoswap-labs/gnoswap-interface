import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import OverlapTokenLogo from "./OverlapTokenLogo";

export default {
  title: "common/OverlapTokenLogo",
  component: OverlapTokenLogo,
} as ComponentMeta<typeof OverlapTokenLogo>;

const Template: ComponentStory<typeof OverlapTokenLogo> = args => (
  <OverlapTokenLogo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  size: 36,
};
