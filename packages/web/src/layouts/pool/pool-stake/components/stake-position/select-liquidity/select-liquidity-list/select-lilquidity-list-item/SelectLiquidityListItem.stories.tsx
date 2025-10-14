import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectLiquidityListItem from "./SelectLiquidityListItem";

const meta = {
  title: "stake/SelectLiquidityListItem",
  component: SelectLiquidityListItem,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectLiquidityListItem>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SelectLiquidityListItem>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof SelectLiquidityListItem>[K];
}>;

export const Default: Story = {
  args: {
    checkedList: [],
    onCheckedItem: fn(),
  },
  render: (args: React.ComponentProps<typeof SelectLiquidityListItem>) => {
    const [checked, setChecked] = useState(false);
    return (
      <SelectLiquidityListItem
        {...args}
        onCheckedItem={() => setChecked(prev => !prev)}
        checkedList={checked ? [111] : []}
      />
    );
  },
};
