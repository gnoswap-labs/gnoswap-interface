import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SwapCardHeader from "./SwapCardHeader";

const meta = {
  title: "swap/SwapCardHeader",
  component: SwapCardHeader,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <div css={headerWrap}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SwapCardHeader>;

export default meta;
type Story = StoryObj<typeof SwapCardHeader>;

export const Default: Story = {
  args: {
    copied: false,
    copyURL: fn(),
    slippage: 0,
    changeSlippage: fn(),
  },
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
