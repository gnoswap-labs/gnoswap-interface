import React from "react";
import { css } from "@emotion/react";
import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs";
import SettingMenuModal from "./SettingMenuModal";

const meta = {
  title: "swap/SettingMenuModal",
  component: SettingMenuModal,
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
} satisfies Meta<typeof SettingMenuModal>;

export default meta;
type Story = StoryObj<typeof SettingMenuModal>;

export const Default: Story = {
  args: {
    slippage: 0,
    changeSlippage: fn(),
    close: fn(),
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
