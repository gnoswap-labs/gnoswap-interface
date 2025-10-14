import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import HighestAprsCardList from "./HighestAprsCardList";

const meta = {
  title: "home/HighestAprsCardList",
  component: HighestAprsCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof HighestAprsCardList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof HighestAprsCardList>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof HighestAprsCardList>[K];
}>;

export const Default: Story = {
  args: {
    list: [],
  },
};
