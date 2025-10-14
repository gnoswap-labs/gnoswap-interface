import type { Meta, StoryObj } from "@storybook/nextjs";

import InfoBox from "./InfoBox";

const meta = {
  title: "governance/InfoBox",
  component: InfoBox,
  tags: ["autodocs"],
} satisfies Meta<typeof InfoBox>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof InfoBox>]?: React.ComponentProps<typeof InfoBox>[K];
}>;

export const Default: Story = {
  args: {
    title: "Default",
    value: "$1.10",
    tooltip: undefined,
  },
};

export const DefaultTooltip: Story = {
  args: {
    title: "DefaultTooltip",
    value: "$1.10",
    tooltip: "Hello world",
  },
};
