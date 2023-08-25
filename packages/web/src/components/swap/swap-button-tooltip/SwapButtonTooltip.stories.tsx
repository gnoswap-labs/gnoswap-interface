import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapButtonTooltip from "./SwapButtonTooltip";
import { css } from "@emotion/react";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";

export default {
  title: "swap/SwapButtonTooltip",
  component: SwapButtonTooltip,
} as ComponentMeta<typeof SwapButtonTooltip>;

const Template: ComponentStory<typeof SwapButtonTooltip> = args => (
  <div css={wrapper}>
    <div>
      <SwapButtonTooltip {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  swapGasInfo: dummySwapGasInfo,
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
`;
