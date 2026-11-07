import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_LIMIT_ORDER_SUMMARY } from "../common/order-story-fixtures";
import ConfirmLimitOrderModal from "./ConfirmLimitOrderModal";

const meta = {
  title: "order/ConfirmLimitOrderModal",
  component: ConfirmLimitOrderModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmLimitOrderModal>;

export default meta;
type Story = StoryObj<typeof ConfirmLimitOrderModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmLimitOrderModal>) => (
    <div css={wrapper}>
      <ConfirmLimitOrderModal {...args} />
    </div>
  ),
  args: {
    summary: STORY_LIMIT_ORDER_SUMMARY,
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
