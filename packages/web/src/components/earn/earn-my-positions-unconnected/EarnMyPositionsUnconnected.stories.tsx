import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositionsUnconnected from "./EarnMyPositionsUnconnected";

export default {
  title: "earn/EarnMyPositionsUnconnected",
  component: EarnMyPositionsUnconnected,
} as ComponentMeta<typeof EarnMyPositionsUnconnected>;

const Template: ComponentStory<typeof EarnMyPositionsUnconnected> = () => (
  <EarnMyPositionsUnconnected />
);

export const Default = Template.bind({});
Default.args = {};
