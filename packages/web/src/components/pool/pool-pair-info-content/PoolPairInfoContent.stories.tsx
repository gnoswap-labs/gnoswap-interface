import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoContent from "./PoolPairInfoContent";

export default {
  title: "pool/PoolPairInfoContent",
  component: PoolPairInfoContent,
} as ComponentMeta<typeof PoolPairInfoContent>;

const Template: ComponentStory<typeof PoolPairInfoContent> = args => (
  <PoolPairInfoContent {...args} />
);

export const Default = Template.bind({});
Default.args = {};
