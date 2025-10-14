import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import Tooltip from "./Tooltip";

const meta = {
  title: "common/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof Tooltip>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof Tooltip>[K];
}>;

export const Default: Story = {
  args: {
    placement: "top",
  },
  render: (args: React.ComponentProps<typeof Tooltip>) => (
    <div
      style={{
        width: 200,
        height: 300,
        backgroundColor: "yellow",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          marginTop: 200,
          height: 500,
        }}
      >
        <Tooltip placement={args.placement} FloatingContent={<div>Hello Gnoswap</div>}>
          <div
            style={{
              width: 200,
              height: 100,
              backgroundColor: "green",
              textAlign: "center",
            }}
          />
        </Tooltip>
      </div>
    </div>
  ),
};
