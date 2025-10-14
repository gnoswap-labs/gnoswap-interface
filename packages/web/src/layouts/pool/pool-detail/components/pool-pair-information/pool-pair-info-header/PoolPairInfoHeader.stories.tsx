import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { PoolRepositoryMock } from "@repositories/pool";

import PoolPairInfoHeader from "./PoolPairInfoHeader";

const poolRepository = new PoolRepositoryMock();
const pool = await poolRepository.getPoolDetailByPoolPath();

const meta = {
  title: "pool/PoolPairInfoHeader",
  component: PoolPairInfoHeader,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <div css={contentWrap}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PoolPairInfoHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolPairInfoHeader>]?: React.ComponentProps<typeof PoolPairInfoHeader>[K];
}>;

export const Default: Story = {
  args: {
    tokenA: pool.tokenA,
    tokenB: pool.tokenB,
    feeStr: "0.01%",
    incentivzed: true,
    rewardTokens: [],
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
