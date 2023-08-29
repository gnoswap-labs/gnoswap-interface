import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakingContent from "./StakingContent";
import {
  rewardInfoInit,
  stakingInit,
} from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

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
  rewardInfo: rewardInfoInit,
  breakpoint: DEVICE_TYPE.WEB,
  mobile: false,
};
