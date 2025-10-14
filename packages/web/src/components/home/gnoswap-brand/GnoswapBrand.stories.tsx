import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import GnoswapBrand from "./GnoswapBrand";

const meta = {
  title: "home/GnoswapBrand",
  component: GnoswapBrand,
  tags: ["autodocs"],
} satisfies Meta<typeof GnoswapBrand>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof GnoswapBrand>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof GnoswapBrand>[K];
}>;

export const Default: Story = {
  args: {
    onClickSns: fn(),
  },
};
