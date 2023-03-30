import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Badge, { BADGE_TYPE } from "./Badge";
import IconStaking from "@components/common/icons/IconStaking";

export default {
  title: "common/Badge",
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = args => <Badge {...args} />;

export const Line = Template.bind({});
Line.args = {
  type: BADGE_TYPE.LINE,
  text: "Line",
};

export const Primary = Template.bind({});
Primary.args = {
  type: BADGE_TYPE.PRIMARY,
  text: "Primary",
};

export const LightDefault = Template.bind({});
LightDefault.args = {
  type: BADGE_TYPE.LIGHT_DEFAULT,
  text: "LightDefault",
};

export const DarkDefault = Template.bind({});
DarkDefault.args = {
  type: BADGE_TYPE.DARK_DEFAULT,
  text: "DarkDefault",
};

export const LeftIcon = Template.bind({});
LeftIcon.args = {
  type: BADGE_TYPE.PRIMARY,
  text: "Staked",
  leftIcon: <IconStaking />,
};
