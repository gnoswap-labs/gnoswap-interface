import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import Switch from "./Switch";

const meta = {
  title: "common/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof Switch>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof Switch>[K];
}>;

export const Default: Story = {
  args: {
    hasLabel: true,
    labelText: "Hide zero balances",
    disabled: false,
  },
  render: (args: React.ComponentProps<typeof Switch>) => {
    const [checked, setChecked] = useState(false);
    const onChange = () => setChecked((prev: boolean) => !prev);
    return <Switch {...args} checked={checked} onChange={onChange} />;
  },
};
