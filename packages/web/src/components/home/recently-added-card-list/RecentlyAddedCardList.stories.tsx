import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import RecentlyAddedCardList from "./RecentlyAddedCardList";

const meta = {
  title: "home/RecentlyAddedCardList",
  component: RecentlyAddedCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof RecentlyAddedCardList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof RecentlyAddedCardList>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof RecentlyAddedCardList>[K];
}>;

export const Default: Story = {
  args: {
    list: [],
  },
};
