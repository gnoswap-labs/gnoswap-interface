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
      Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
    },
  },
};
