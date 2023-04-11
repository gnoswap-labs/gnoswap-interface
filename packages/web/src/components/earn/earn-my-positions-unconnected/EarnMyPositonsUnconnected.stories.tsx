import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositonsUnconnected from "./EarnMyPositonsUnconnected";

export default {
  title: "earn/EarnMyPositonsUnconnected",
  component: EarnMyPositonsUnconnected,
} as ComponentMeta<typeof EarnMyPositonsUnconnected>;

const Template: ComponentStory<typeof EarnMyPositonsUnconnected> = () => (
  <EarnMyPositonsUnconnected />
);

export const Default = Template.bind({});
Default.args = {};
