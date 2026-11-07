import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_DCA_ORDER_SUMMARY } from "../common/order-story-fixtures";
import ConfirmDcaOrderModal from "./ConfirmDcaOrderModal";

const meta = {
  title: "order/ConfirmDcaOrderModal",
  component: ConfirmDcaOrderModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmDcaOrderModal>;

export default meta;
type Story = StoryObj<typeof ConfirmDcaOrderModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmDcaOrderModal>) => (
    <div css={wrapper}>
      <ConfirmDcaOrderModal {...args} />
    </div>
  ),
  args: {
    summary: STORY_DCA_ORDER_SUMMARY,
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

export const WithRemainder: Story = {
  ...Default,
  args: {
    ...Default.args,
    summary: { ...STORY_DCA_ORDER_SUMMARY, sellAmount: "1000", executionCount: 3, actualSellAmount: "999.999999" },
  },
};
