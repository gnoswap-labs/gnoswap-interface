import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import InfoBox from "./InfoBox";

export default {
  title: "governance/InfoBox",
  component: InfoBox,
} as ComponentMeta<typeof InfoBox>;

const Template: ComponentStory<typeof InfoBox> = (args) => (
  <InfoBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Default",
  value: "$1.10",
  tooltip: undefined,
};

export const DefaultTooltip = Template.bind({});
DefaultTooltip.args = {
  title: "DefaultTooltip",
  value: "$1.10",
  tooltip: "Hello world",
};
