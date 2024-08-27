import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import GovernanceDetailInfo from "./GovernanceDetailInfo";

export default {
  title: "governance/GovernanceDetailInfo",
  component: GovernanceDetailInfo,
} as ComponentMeta<typeof GovernanceDetailInfo>;

const Template: ComponentStory<typeof GovernanceDetailInfo> = (args) => (
  <GovernanceDetailInfo {...args} />
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
