import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenDescription from "./TokenDescription";

const meta = {
  title: "token/TokenDescription",
  component: TokenDescription,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenDescription>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof TokenDescription>]?: React.ComponentProps<typeof TokenDescription>[K];
}>;

export const Default: Story = {
  args: {
    tokenName: "Bitcoin",
    tokenSymbol: "BTC",
    content: "description",
    links: {
      Website: "https://gnoswap.io",
      Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
    },
  },
};
