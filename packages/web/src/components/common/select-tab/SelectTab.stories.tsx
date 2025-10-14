import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectTab from "./SelectTab";

const meta = {
  title: "common/SelectTab",
  component: SelectTab,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectTab>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SelectTab>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof SelectTab>[K];
}>;

export const Default: Story = {
  args: {
    list: ["All", "Incentivized", "Non-Incentivized"],
  },
};
