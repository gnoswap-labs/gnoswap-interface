import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import OverlapTokenLogo from "./OverlapTokenLogo";

const meta = {
  title: "common/OverlapTokenLogo",
  component: OverlapTokenLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof OverlapTokenLogo>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof OverlapTokenLogo>]?: React.ComponentProps<typeof OverlapTokenLogo>[K];
}>;

export const Default: Story = {
  args: {
    size: 36,
  },
};
