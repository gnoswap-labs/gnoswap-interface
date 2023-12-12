import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInfoContent from "./PoolPairInfoContent";
import { css } from "@emotion/react";
import { PoolRepositoryMock } from "@repositories/pool";

export default {
  title: "pool/PoolPairInfoContent",
  component: PoolPairInfoContent,
} as ComponentMeta<typeof PoolPairInfoContent>;

const Template: ComponentStory<typeof PoolPairInfoContent> = args => (
  <div css={wrapper}>
    <PoolPairInfoContent {...args} />
  </div>
);

const poolRepository = new PoolRepositoryMock();
const pool = (await poolRepository.getPoolDetailByPoolPath());

export const Default = Template.bind({});
Default.args = {
  pool
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
