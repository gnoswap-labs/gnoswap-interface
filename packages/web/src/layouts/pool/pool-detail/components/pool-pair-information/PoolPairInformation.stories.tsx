import type { Meta, StoryObj } from "@storybook/nextjs";
import { css } from "@emotion/react";
import { fn } from "@storybook/test";

import PoolPairInformation from "./PoolPairInformation";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();
const pool = await poolRepository.getPoolDetailByPoolPath();

const meta = {
  title: "pool/PoolPairInformation",
  component: PoolPairInformation,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <div css={contentWrap}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PoolPairInformation>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PoolPairInformation>]?: React.ComponentProps<typeof PoolPairInformation>[K];
}>;

export const Default: Story = {
  args: {
    pool,
    feeStr: "0.01%",
    onClickPath: fn(),
  },
};

const wrapper = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = css`
  width: 1000px;
`;
