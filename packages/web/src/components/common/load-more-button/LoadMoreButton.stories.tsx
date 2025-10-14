import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import LoadMoreButton, { TEXT_TYPE } from "./LoadMoreButton";

const meta = {
  title: "common/LoadMoreButton",
  component: LoadMoreButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadMoreButton>;

export default meta;
type Story = StoryObj<typeof LoadMoreButton>;

export const LoadType: Story = {
  args: {
    show: true,
    onClick: fn(),
    text: TEXT_TYPE.LOAD,
  },
};

export const ShowType: Story = {
  args: {
    show: true,
    onClick: fn(),
    text: TEXT_TYPE.SHOW,
  },
};
