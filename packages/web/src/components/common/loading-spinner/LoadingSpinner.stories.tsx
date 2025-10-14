import type { Meta, StoryObj } from "@storybook/nextjs";
import LoadingSpinner from "./LoadingSpinner";

const meta = {
  title: "common/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
