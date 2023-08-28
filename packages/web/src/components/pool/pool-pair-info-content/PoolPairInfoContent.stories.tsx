import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoContent from "./PoolPairInfoContent";
import { poolPairInit } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { css } from "@emotion/react";

export default {
  title: "pool/PoolPairInfoContent",
  component: PoolPairInfoContent,
} as ComponentMeta<typeof PoolPairInfoContent>;

const Template: ComponentStory<typeof PoolPairInfoContent> = args => (
  <div css={wrapper}>
    <PoolPairInfoContent {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  content: poolPairInit,
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
