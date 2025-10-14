import type { Meta, StoryObj } from "@storybook/nextjs";

import WalletMyPositionsHeader from "./WalletMyPositionsHeader";

const meta = {
  title: "wallet/WalletMyPositionsHeader",
  component: WalletMyPositionsHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletMyPositionsHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof WalletMyPositionsHeader>]?: React.ComponentProps<
    typeof WalletMyPositionsHeader
  >[K];
}>;

export const Default: Story = {
  args: {},
};
