import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LearnMoreModal from "./LearnMoreModal";

export default {
  title: "governance/LearnMoreModal",
  component: LearnMoreModal,
} as ComponentMeta<typeof LearnMoreModal>;

const Template: ComponentStory<typeof LearnMoreModal> = args => (
  <LearnMoreModal {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const DefaultTooltip = Template.bind({});
DefaultTooltip.args = {};
