import { action } from "@storybook/addon-actions";
import SelectBox, { type SelectBoxProps } from "./SelectBox";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/SelectBox",
  component: SelectBox,
} as Meta<typeof SelectBox>;

export const Default: StoryObj<SelectBoxProps<string>> = {
  args: {
    current: "",
    items: ["1", "2", "3", "4"],
    select: action("select"),
    render: (item: string) => <span>{item}</span>,
  },
};