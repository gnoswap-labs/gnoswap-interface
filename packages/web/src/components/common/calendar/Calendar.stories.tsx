import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import Calendar from "./Calendar";

const meta = {
  title: "common/Calendar",
  component: Calendar,
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: {
      year: 2022,
      month: 12,
      date: 24,
    },
    dayOfWeeks: ["S", "M", "T", "W", "T", "F", "S"],
    onClickDate: fn(),
  },
};
