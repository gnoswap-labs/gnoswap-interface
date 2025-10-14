import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { DEVICE_TYPE } from "@styles/media";

import MyLiquidityContent from "./MyLiquidityContent";

const meta = {
  title: "pool/MyLiquidityContent",
  component: MyLiquidityContent,
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
} satisfies Meta<typeof MyLiquidityContent>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MyLiquidityContent>]?: React.ComponentProps<typeof MyLiquidityContent>[K];
}>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
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
  width: 1000px;
`;
