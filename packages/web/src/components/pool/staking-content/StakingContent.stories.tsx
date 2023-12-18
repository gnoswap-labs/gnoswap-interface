import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakingContent from "./StakingContent";
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
  breakpoint: DEVICE_TYPE.WEB,
  mobile: false,
};
