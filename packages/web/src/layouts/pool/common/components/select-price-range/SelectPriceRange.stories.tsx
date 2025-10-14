import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectPriceRange from "./SelectPriceRange";

const meta = {
  title: "common/AddLiquidity/SelectPriceRange",
  component: SelectPriceRange,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectPriceRange>;

export default meta;
type Story = StoryObj<typeof SelectPriceRange>;

export const Default: Story = {
  args: {
    priceRanges: [],
    priceRange: undefined,
    changePriceRange: fn(),
  },
};
