import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import GnoswapBrand from "./GnoswapBrand";

const meta = {
  title: "home/GnoswapBrand",
  component: GnoswapBrand,
  tags: ["autodocs"],
} satisfies Meta<typeof GnoswapBrand>;

export default meta;
type Story = StoryObj<typeof GnoswapBrand>;

export const Default: Story = {
  args: {
    onClickSns: fn(),
  },
};
