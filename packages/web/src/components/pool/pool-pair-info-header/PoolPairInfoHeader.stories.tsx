import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoHeader from "./PoolPairInfoHeader";
import { css } from "@emotion/react";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();
const pool = (await poolRepository.getPoolDetailByPoolPath());

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
  tokenA: pool.tokenA,
  tokenB: pool.tokenB,
  feeStr: "0.01%",
  incentivizedType: pool.incentiveType,
  rewardTokens: [],
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
