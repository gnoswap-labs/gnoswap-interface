import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import ConfirmSwapModal from "./ConfirmSwapModal";

export default {
  title: "swap/ConfirmSwapModal",
  component: ConfirmSwapModal,
} as ComponentMeta<typeof ConfirmSwapModal>;

const Template: ComponentStory<typeof ConfirmSwapModal> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <ConfirmSwapModal {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  submitted: false,
  // @dev:  add again if necessary
  // swapTokenInfo,
  // swapSummaryInfo,
  swapResult: null,
  swap: action("swap"),
  close: action("close"),
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
