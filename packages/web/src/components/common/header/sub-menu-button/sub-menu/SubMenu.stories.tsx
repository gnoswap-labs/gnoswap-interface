import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css, Theme } from "@emotion/react";
import { fn } from "@storybook/test";

import SubMenu from "./SubMenu";

const meta = {
  title: "common/Header/SubMenu",
  component: SubMenu,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubMenu>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SubMenu>]?: React.ComponentProps<typeof SubMenu>[K];
}>;

export const Default: Story = {
  args: {
    onSideMenuToggle: fn(),
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
