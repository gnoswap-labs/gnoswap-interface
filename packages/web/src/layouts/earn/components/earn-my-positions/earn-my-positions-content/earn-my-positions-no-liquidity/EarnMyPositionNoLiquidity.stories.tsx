import type { Meta, StoryObj } from "@storybook/nextjs";
import EarnMyPositionNoLiquidity from "./EarnMyPositionNoLiquidity";

const meta = {
  title: "earn/EarnMyPositionNoLiquidity",
  component: EarnMyPositionNoLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositionNoLiquidity>;

export default meta;
type Story = StoryObj<typeof EarnMyPositionNoLiquidity>;

export const Default: Story = {
  args: {
    account: null,
  },
};
