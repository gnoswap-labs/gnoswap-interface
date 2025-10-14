import type { Meta, StoryObj } from "@storybook/nextjs";
import EarnMyPositionNoLiquidity from "./EarnMyPositionNoLiquidity";

const meta = {
  title: "earn/EarnMyPositionNoLiquidity",
  component: EarnMyPositionNoLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof EarnMyPositionNoLiquidity>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof EarnMyPositionNoLiquidity>]?: React.ComponentProps<
    typeof EarnMyPositionNoLiquidity
  >[K];
}>;

export const Default: Story = {
  args: {
    account: null,
  },
};
