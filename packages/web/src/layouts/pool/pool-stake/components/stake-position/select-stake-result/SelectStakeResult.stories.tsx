import type { Meta, StoryObj } from "@storybook/nextjs";

import SelectStakeResult from "./SelectStakeResult";

const meta = {
  title: "stake/SelectStakeResult",
  component: SelectStakeResult,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectStakeResult>;

export default meta;
type Story = StoryObj<typeof SelectStakeResult>;

export const Default: Story = {
  args: {},
};
