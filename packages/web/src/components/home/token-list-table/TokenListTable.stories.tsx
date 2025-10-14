import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenListTable from "./TokenListTable";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

const meta = {
  title: "home/TokenList/TokenListTable",
  component: TokenListTable,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenListTable>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof TokenListTable>]?: React.ComponentProps<typeof TokenListTable>[K];
}>;

export const Default: Story = {
  args: {
    tokens: createDummyTokenList(),
    isFetched: true,
  },
};

export const Skeleton: Story = {
  args: {
    tokens: [],
    isFetched: false,
  },
};

export const NotFound: Story = {
  args: {
    tokens: [],
    isFetched: true,
  },
};
