import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidityContent from "./MyLiquidityContent";
import { liquidityInit } from "@containers/my-liquidity-container/MyLiquidityContainer";
import { css } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/MyLiquidityContent",
  component: MyLiquidityContent,
} as ComponentMeta<typeof MyLiquidityContent>;

const Template: ComponentStory<typeof MyLiquidityContent> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <MyLiquidityContent {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  content: liquidityInit,
  breakpoint: DEVICE_TYPE.WEB,
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
