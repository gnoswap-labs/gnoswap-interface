import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";

const meta = {
  title: "home/TokenList/TokenListHeader",
  component: TokenListHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenListHeader>;

export default meta;
type Story = StoryObj<typeof TokenListHeader>;

export const Default: Story = {
  args: {
    tokenType: TOKEN_TYPE.ALL,
    changeTokenType: fn(),
    search: fn(),
    breakpoint: DEVICE_TYPE.WEB,
    keyword: "",
    searchIcon: true,
    onTogleSearch: fn(),
    showUnverifiedTokens: false,
    toggleShowUnverifiedTokens: fn(),
  },
};
