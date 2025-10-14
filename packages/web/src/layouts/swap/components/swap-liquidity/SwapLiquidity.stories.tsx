import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import SwapLiquidity, { dummyLiquidityList } from "./SwapLiquidity";
import React from "react";

const meta = {
  title: "swap/SwapLiquidity",
  component: SwapLiquidity,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SwapLiquidity>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SwapLiquidity>]?: React.ComponentProps<typeof SwapLiquidity>[K];
}>;

export const Default: Story = {
  args: {
    liquiditys: dummyLiquidityList,
  },
};

export const NoLiquidity: Story = {
  args: {
    liquiditys: [],
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
