import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityHeader from "./MyLiquidityHeader";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";
import { css } from "@emotion/react";

export default {
  title: "pool/MyLiquidityHeader",
  component: MyLiquidityHeader,
} as ComponentMeta<typeof MyLiquidityHeader>;

const Template: ComponentStory<typeof MyLiquidityHeader> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <MyLiquidityHeader {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  info: liquidityInit.poolInfo,
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
