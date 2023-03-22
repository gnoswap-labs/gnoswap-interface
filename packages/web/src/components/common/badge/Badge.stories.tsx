import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Badge from "./Badge";
import { BadgeHierarchy } from "./Badge.styles";

export default {
  title: "common/Badge",
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = args => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: "0.3%",
  style: {
    hierarchy: BadgeHierarchy.Default,
  },
};

export const Primary = Template.bind({});
Primary.args = {
  text: "0.3%",
  style: {
    hierarchy: BadgeHierarchy.Primary,
  },
};

export const Line = Template.bind({});
Line.args = {
  text: "0.3%",
  style: {
    hierarchy: BadgeHierarchy.Line,
  },
};
