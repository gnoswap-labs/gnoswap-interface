import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import EarnMyPositionsHeader from "./EarnMyPositionsHeader";

const meta = {
  title: "earn/EarnMyPositionsHeader",
  component: EarnMyPositionsHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositionsHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof EarnMyPositionsHeader>]?: React.ComponentProps<
    typeof EarnMyPositionsHeader
  >[K];
}>;

export const Default: Story = {
  args: {
    connected: true,
    moveEarnAdd: fn(),
  },
};
