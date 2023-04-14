import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakingContent from "./StakingContent";
import { stakingInit } from "@containers/staking-container/StakingContainer";

export default {
  title: "pool/StakingContent",
  component: StakingContent,
} as ComponentMeta<typeof StakingContent>;

const Template: ComponentStory<typeof StakingContent> = args => (
  <StakingContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: stakingInit,
};
