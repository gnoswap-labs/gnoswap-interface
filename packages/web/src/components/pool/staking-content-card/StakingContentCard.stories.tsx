import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakingContentCard from "./StakingContentCard";
import { stakingInit } from "@containers/staking-container/StakingContainer";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/StakingContentCard",
  component: StakingContentCard,
} as ComponentMeta<typeof StakingContentCard>;

const Template: ComponentStory<typeof StakingContentCard> = args => (
  <StakingContentCard {...args} />
);

export const ActiveStaking = Template.bind({});
ActiveStaking.args = {
  item: stakingInit[0],
  breakpoint: DEVICE_TYPE.WEB,
};

export const UnActiveStaking = Template.bind({});
UnActiveStaking.args = {
  item: stakingInit[1],
  breakpoint: DEVICE_TYPE.WEB,
};
