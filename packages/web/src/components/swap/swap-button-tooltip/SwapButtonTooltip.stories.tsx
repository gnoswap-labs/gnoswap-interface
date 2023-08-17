import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapButtonTooltip from "./SwapButtonTooltip";
import { css, Theme } from "@emotion/react";
import { dummySwapGasInfo } from "@containers/swap-container/SwapContainer";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

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
  children: (
    <Button
      text="Swap"
      style={{
        width: 450,
        height: 57,
        fontType: "body7",
        hierarchy: ButtonHierarchy.Primary,
      }}
      onClick={() => {}}
    />
  ),
};

const wrapper = (theme: Theme) => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
`;
