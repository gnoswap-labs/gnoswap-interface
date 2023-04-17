import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Staking from "./Staking";
import { stakingInit } from "@containers/staking-container/StakingContainer";

export default {
  title: "pool/Staking",
  component: Staking,
} as ComponentMeta<typeof Staking>;

const Template: ComponentStory<typeof Staking> = args => <Staking {...args} />;

export const Default = Template.bind({});
Default.args = {
  info: stakingInit,
};
