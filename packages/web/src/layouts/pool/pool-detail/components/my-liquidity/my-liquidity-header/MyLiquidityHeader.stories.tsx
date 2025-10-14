import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import MyLiquidityHeader from "./MyLiquidityHeader";

const meta = {
  title: "pool/MyLiquidityHeader",
  component: MyLiquidityHeader,
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
} satisfies Meta<typeof MyLiquidityHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MyLiquidityHeader>]?: React.ComponentProps<typeof MyLiquidityHeader>[K];
}>;

export const Default: Story = {
  args: {},
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
