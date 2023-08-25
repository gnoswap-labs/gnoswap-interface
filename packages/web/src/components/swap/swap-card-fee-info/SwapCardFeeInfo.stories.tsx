import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardFeeInfo from "./SwapCardFeeInfo";
import { css, Theme } from "@emotion/react";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";
import { action } from "@storybook/addon-actions";

export default {
  title: "swap/SwapCardFeeInfo",
  component: SwapCardFeeInfo,
} as ComponentMeta<typeof SwapCardFeeInfo>;

const Template: ComponentStory<typeof SwapCardFeeInfo> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SwapCardFeeInfo {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  autoRouter: true,
  showAutoRouter: action("onClick"),
  swapGasInfo: dummySwapGasInfo,
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
