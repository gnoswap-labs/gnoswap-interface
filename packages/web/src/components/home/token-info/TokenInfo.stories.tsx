import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css, Theme } from "@emotion/react";

import TokenInfo from "./TokenInfo";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

const meta = {
  title: "home/TokenList/TokenInfo",
  component: TokenInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenInfo>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof TokenInfo>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof TokenInfo>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof TokenInfo>) => (
    <div css={wrapper}>
      <TokenInfo {...args} item={createDummyTokenList()[0]} idx={1} />
    </div>
  ),
  args: {},
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
