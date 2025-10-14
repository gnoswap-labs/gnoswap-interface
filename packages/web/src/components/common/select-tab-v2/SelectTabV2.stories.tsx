import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectTab from "./SelectTabV2";

const meta = {
  title: "common/SelectTabV2",
  component: SelectTab,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectTab>;

export default meta;
type Story = StoryObj<typeof SelectTab>;

export const Default: Story = {
  args: {
    list: [
      { display: "All", key: "all" },
      { display: "Incentivized", key: "Incentivized" },
      { display: "Non-Incentivized", key: "Incentivized" },
    ],
  },
};
