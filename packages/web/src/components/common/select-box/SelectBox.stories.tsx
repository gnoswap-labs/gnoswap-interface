import { fn } from "@storybook/test";
import SelectBox, { type SelectBoxProps } from "./SelectBox";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: "common/SelectBox",
  component: SelectBox<string>,
  tags: ["autodocs"],
} satisfies Meta<SelectBoxProps<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    current: "",
    items: ["1", "2", "3", "4"],
    select: fn(),
    render: (item: string) => <span>{item}</span>,
  },
};
