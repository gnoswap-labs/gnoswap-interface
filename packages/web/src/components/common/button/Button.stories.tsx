import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "./Button";
import { ButtonHierarchy } from "./Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";

export default {
  title: "common/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: "Primary",
  style: {
    hierarchy: ButtonHierarchy.Primary,
    width: 130,
    height: 50,
  },
};

export const Dark = Template.bind({});
Dark.args = {
  text: "Dark",
  style: {
    hierarchy: ButtonHierarchy.Dark,
    width: 130,
    height: 50,
  },
};

export const LeftIconButton = Template.bind({});
LeftIconButton.args = {
  leftIcon: <IconDownload />,
  text: "Left Icon Button",
  style: {
    bgColor: "background02",
    width: 180,
    height: 50,
    justify: "space-between",
    padding: "0px 10px",
    textColor: "text01",
  },
};

export const RightIconButton = Template.bind({});
RightIconButton.args = {
  rightIcon: <IconStrokeArrowDown />,
  text: "Right Icon Button",
  style: {
    bgColor: "background01",
    width: 180,
    height: 50,
    justify: "space-between",
    padding: "0px 10px",
    textColor: "text01",
  },
};

export const FullWidthButton = Template.bind({});
FullWidthButton.args = {
  text: "Full Width Button",
  style: {
    bgColor: "background03",
    fullWidth: true,
    height: 50,
    textColor: "text01",
  },
};
