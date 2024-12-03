import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyLiquidity from "./MyLiquidity";
import { css } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/MyLiquidity",
  component: MyLiquidity,
} as ComponentMeta<typeof MyLiquidity>;

const Template: ComponentStory<typeof MyLiquidity> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <MyLiquidity {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
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
