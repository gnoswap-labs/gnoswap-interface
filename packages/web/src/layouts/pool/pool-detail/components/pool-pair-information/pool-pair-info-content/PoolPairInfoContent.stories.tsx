import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { PoolRepositoryMock } from "@repositories/pool";

import PoolPairInfoContent from "./PoolPairInfoContent";
import React from "react";

const poolRepository = new PoolRepositoryMock();
const pool = await poolRepository.getPoolDetailByPoolPath();

const meta = {
  title: "pool/PoolPairInfoContent",
  component: PoolPairInfoContent,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PoolPairInfoContent>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolPairInfoContent>]?: React.ComponentProps<typeof PoolPairInfoContent>[K];
}>;

export const Default: Story = {
  args: {
    pool,
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
