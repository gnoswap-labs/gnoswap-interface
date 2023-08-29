import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Staking from "./Staking";
import {
  rewardInfoInit,
  stakingInit,
} from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/Staking",
  component: Staking,
} as ComponentMeta<typeof Staking>;

const Template: ComponentStory<typeof Staking> = args => <Staking {...args} />;

export const Default = Template.bind({});
Default.args = {
  info: stakingInit,
  rewardInfo: rewardInfoInit,
  breakpoint: DEVICE_TYPE.WEB,
  mobile: false,
};
