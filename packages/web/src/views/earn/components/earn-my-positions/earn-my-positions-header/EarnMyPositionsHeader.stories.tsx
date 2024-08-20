import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositionsHeader from "./EarnMyPositionsHeader";
import { action } from "@storybook/addon-actions";

export default {
  title: "earn/EarnMyPositionsHeader",
  component: EarnMyPositionsHeader,
} as ComponentMeta<typeof EarnMyPositionsHeader>;

const Template: ComponentStory<typeof EarnMyPositionsHeader> = args => (
  <EarnMyPositionsHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  connected: true,
  moveEarnAdd: action("moveEarnAdd")
};
