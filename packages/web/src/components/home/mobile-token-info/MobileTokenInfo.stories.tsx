import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css, Theme } from "@emotion/react";

import MobileTokenInfo from "./MobileTokenInfo";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

const meta = {
  title: "home/TokenList/MobileTokenInfo",
  component: MobileTokenInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof MobileTokenInfo>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MobileTokenInfo>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof MobileTokenInfo>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof MobileTokenInfo>) => (
    <div css={wrapper}>
      <MobileTokenInfo {...args} item={createDummyTokenList()[0]} idx={1} />
    </div>
  ),
  args: {},
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
