import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInformation from "./PoolPairInformation";

export default {
  title: "pool/PoolPairInformation",
  component: PoolPairInformation,
} as ComponentMeta<typeof PoolPairInformation>;

const Template: ComponentStory<typeof PoolPairInformation> = args => (
  <PoolPairInformation {...args} />
);

export const Default = Template.bind({});
Default.args = {};
