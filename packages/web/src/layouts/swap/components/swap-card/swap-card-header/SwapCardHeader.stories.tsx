import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardHeader from "./SwapCardHeader";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "swap/SwapCardHeader",
  component: SwapCardHeader,
} as ComponentMeta<typeof SwapCardHeader>;

const Template: ComponentStory<typeof SwapCardHeader> = args => (
  <div css={wrapper}>
    <div css={headerWrap}>
      <SwapCardHeader {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  copied: false,
  copyURL: action("copyURL"),
  slippage: 0,
  changeSlippage: action("changeSlippage"),
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const headerWrap = () => css`
  width: 500px;
`;
