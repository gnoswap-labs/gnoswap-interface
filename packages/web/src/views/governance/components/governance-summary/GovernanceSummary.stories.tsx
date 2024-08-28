import { ComponentMeta, ComponentStory } from "@storybook/react";

import { dummyGovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "./GovernanceSummary";

export default {
  title: "governance/GovernanceSummary",
  component: GovernanceSummary,
} as ComponentMeta<typeof GovernanceSummary>;

const Template: ComponentStory<typeof GovernanceSummary> = (args) => (
  <GovernanceSummary {...args} />
);

export const Default = Template.bind({});
Default.args = {
  governanceSummary: dummyGovernanceSummaryInfo,
};
