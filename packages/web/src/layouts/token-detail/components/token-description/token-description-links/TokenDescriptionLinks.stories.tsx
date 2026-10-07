import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenDescriptionLinks from "./TokenDescriptionLinks";

const meta = {
  title: "token/TokenDescriptionLinks",
  component: TokenDescriptionLinks,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenDescriptionLinks>;

export default meta;
type Story = StoryObj<typeof TokenDescriptionLinks>;

export const Default: Story = {
  args: {
    links: {
      Website: "https://gnoswap.io",
      X: "https://x.com/gnoswaplabs",
      Discord: "https://discord.com/invite/u4bdGHStb2",
      Docs: "https://docs.gnoswap.io",
      GnoScan: "https://gnoscan.io/tokens/r/demo/wugnot",
    },
  },
};
