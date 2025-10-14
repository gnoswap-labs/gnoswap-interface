import type { Meta, StoryObj } from "@storybook/nextjs";

import Disclaimer from "./Disclaimer";

const meta = {
  title: "incentivize/Disclaimer",
  component: Disclaimer,
  tags: ["autodocs"],
} satisfies Meta<typeof Disclaimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
