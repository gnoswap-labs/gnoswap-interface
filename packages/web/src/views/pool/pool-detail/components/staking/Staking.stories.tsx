import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DEVICE_TYPE } from "@styles/media";

import Staking from "./Staking";

export default {
  title: "pool/Staking",
  component: Staking,
} as ComponentMeta<typeof Staking>;

const Template: ComponentStory<typeof Staking> = args => <Staking {...args} />;

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  mobile: false,
};
