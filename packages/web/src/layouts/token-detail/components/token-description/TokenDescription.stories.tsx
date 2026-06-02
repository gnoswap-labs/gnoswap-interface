import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenDescription from "./TokenDescription";

const meta = {
  title: "token/TokenDescription",
  component: TokenDescription,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenDescription>;

export default meta;
type Story = StoryObj<typeof TokenDescription>;

export const Default: Story = {
  args: {
    tokenName: "Bitcoin",
    tokenSymbol: "BTC",
    content: "description",
    links: {
      Website: "https://gnoswap.io",
      X: "https://x.com/gnoswaplabs",
      Discord: "https://discord.com/invite/u4bdGHStb2",
      Docs: "https://docs.gnoswap.io",
      GnoScan: "https://gnoscan.io/tokens/r/demo/wugnot",
    },
  },
};
