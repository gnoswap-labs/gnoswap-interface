import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import SubMenuButton from "./SubMenuButton";

const meta = {
  title: "common/SubMenuButton",
  component: SubMenuButton,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          position: "fixed",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubMenuButton>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SubMenuButton>]?: React.ComponentProps<typeof SubMenuButton>[K];
}>;

export const Disconnected: Story = {
  args: {
    sideMenuToggle: true,
  },
};

export const Connected: Story = {
  args: {
    sideMenuToggle: false,
  },
};
