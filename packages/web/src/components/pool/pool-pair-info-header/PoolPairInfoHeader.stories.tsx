import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { poolPairInit } from "@containers/pool-pair-information-container/PoolPairInformationContainer";
import { css } from "@emotion/react";

export default {
  title: "pool/PoolPairInfoHeader",
  component: PoolPairInfoHeader,
} as ComponentMeta<typeof PoolPairInfoHeader>;

const Template: ComponentStory<typeof PoolPairInfoHeader> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <PoolPairInfoHeader {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  info: poolPairInit.poolInfo,
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 500px;
`;
