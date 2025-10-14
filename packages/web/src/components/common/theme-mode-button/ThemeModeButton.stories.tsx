import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import ThemeModeButton from "./ThemeModeButton";

const meta = {
  title: "common/ThemeModeButton",
  component: ThemeModeButton,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeModeButton>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof ThemeModeButton>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof ThemeModeButton>[K];
}>;

export const Default: Story = {
  args: {},
};
