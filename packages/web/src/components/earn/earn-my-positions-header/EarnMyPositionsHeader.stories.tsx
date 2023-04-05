import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositionsHeader from "./EarnMyPositionsHeader";

export default {
  title: "earn/EarnMyPositionsHeader",
  component: EarnMyPositionsHeader,
} as ComponentMeta<typeof EarnMyPositionsHeader>;

const Template: ComponentStory<typeof EarnMyPositionsHeader> = args => (
  <EarnMyPositionsHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {};
