import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css } from "@emotion/react";
import { fn } from "@storybook/test";

import ConfirmSwapModal from "./ConfirmSwapModal";

const meta = {
  title: "swap/ConfirmSwapModal",
  component: ConfirmSwapModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmSwapModal>;

export default meta;
type Story = StoryObj<typeof ConfirmSwapModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmSwapModal>) => (
    <div css={wrapper}>
      <div css={contentWrap}>
        <ConfirmSwapModal {...args} />
      </div>
    </div>
  ),
  args: {
    submitted: false,
    // @dev: add again if necessary
    // swapTokenInfo,
    // swapSummaryInfo,
    swapResult: null,
    swap: fn(),
    close: fn(),
  },
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
