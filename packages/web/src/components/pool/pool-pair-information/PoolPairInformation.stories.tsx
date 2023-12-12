import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PoolPairInformation from "./PoolPairInformation";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();
const pool = (await poolRepository.getPoolDetailByPoolPath());

export default {
  title: "pool/PoolPairInformation",
  component: PoolPairInformation,
} as ComponentMeta<typeof PoolPairInformation>;

const Template: ComponentStory<typeof PoolPairInformation> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <PoolPairInformation {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  pool,
  feeStr: "0.01%",
  onClickPath: action("onClickPath"),
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 1000px;
`;
