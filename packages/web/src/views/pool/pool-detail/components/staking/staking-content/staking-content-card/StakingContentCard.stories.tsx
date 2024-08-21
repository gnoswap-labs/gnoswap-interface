import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DEVICE_TYPE } from "@styles/media";

import StakingContentCard from "./StakingContentCard";

export default {
  title: "pool/StakingContentCard",
  component: StakingContentCard,
} as ComponentMeta<typeof StakingContentCard>;

const Template: ComponentStory<typeof StakingContentCard> = args => (
  <StakingContentCard {...args} />
);

export const ActiveStaking = Template.bind({});
ActiveStaking.args = {
  breakpoint: DEVICE_TYPE.WEB,
};

export const UnActiveStaking = Template.bind({});
UnActiveStaking.args = {
  breakpoint: DEVICE_TYPE.WEB,
};
