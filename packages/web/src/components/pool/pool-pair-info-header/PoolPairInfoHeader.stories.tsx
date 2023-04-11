import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoHeader from "./PoolPairInfoHeader";

export default {
  title: "pool/PoolPairInfoHeader",
  component: PoolPairInfoHeader,
} as ComponentMeta<typeof PoolPairInfoHeader>;

const Template: ComponentStory<typeof PoolPairInfoHeader> = args => (
  <PoolPairInfoHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {};
