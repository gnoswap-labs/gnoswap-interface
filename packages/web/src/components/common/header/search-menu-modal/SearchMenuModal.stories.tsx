import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css, Theme } from "@emotion/react";
import { fn } from "@storybook/test";

import SearchMenuModal from "./SearchMenuModal";

const meta = {
  title: "common/Header/SearchMenuModal",
  component: SearchMenuModal,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchMenuModal>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SearchMenuModal>]?: React.ComponentProps<typeof SearchMenuModal>[K];
}>;

export const Default: Story = {
  args: {
    onSearchMenuToggle: fn(),
    search: fn(),
    keyword: "",
    isFetched: true,
    placeholder: "Search",
    tokens: [],
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
