import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import TokenList from "./TokenList";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";

const meta = {
  title: "home/TokenList",
  component: TokenList,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenList>;

export default meta;
type Story = StoryObj<typeof TokenList>;

export const Default: Story = {
  args: {
    tokens: createDummyTokenList(),
    isFetched: true,
    changeTokenType: fn(),
    search: fn(),
    currentPage: 0,
    totalPage: 10,
    movePage: fn(),
    breakpoint: DEVICE_TYPE.WEB,
    showUnverifiedTokens: false,
    toggleShowUnverifiedTokens: fn(),
  },
};
