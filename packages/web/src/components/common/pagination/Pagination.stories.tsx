import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import Pagination from "./Pagination";

const meta = {
  title: "common/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalPage: 100,
    currentPage: 0,
    onPageChange: fn(),
  },
};
