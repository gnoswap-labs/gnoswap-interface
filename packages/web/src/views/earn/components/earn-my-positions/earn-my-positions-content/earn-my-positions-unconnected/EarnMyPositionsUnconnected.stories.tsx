import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import EarnMyPositionsUnconnected from "./EarnMyPositionsUnconnected";
import { action } from "@storybook/addon-actions";

export default {
  title: "earn/EarnMyPositionsUnconnected",
  component: EarnMyPositionsUnconnected,
} as ComponentMeta<typeof EarnMyPositionsUnconnected>;

const Template: ComponentStory<typeof EarnMyPositionsUnconnected> = args => (
  <EarnMyPositionsUnconnected {...args} />
);

export const Default = Template.bind({});
Default.args = {
  connect: action("connect")
};
