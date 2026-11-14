import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_STOP_ORDER_SUMMARY } from "../common/order-story-fixtures";
import ConfirmStopOrderModal from "./ConfirmStopOrderModal";

const meta = {
  title: "order/ConfirmStopOrderModal",
  component: ConfirmStopOrderModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmStopOrderModal>;

export default meta;
type Story = StoryObj<typeof ConfirmStopOrderModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmStopOrderModal>) => (
    <div css={wrapper}>
      <ConfirmStopOrderModal {...args} />
    </div>
  ),
  args: {
    summary: STORY_STOP_ORDER_SUMMARY,
    confirm: fn(),
    close: fn(),
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const LimitCancel: Story = {
  ...Default,
  args: {
    ...Default.args,
    summary: { ...STORY_STOP_ORDER_SUMMARY, kind: "limit", statusLabel: "Partially Filled" },
  },
};
