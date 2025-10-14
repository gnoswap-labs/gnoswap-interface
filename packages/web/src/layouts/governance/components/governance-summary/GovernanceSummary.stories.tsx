import type { Meta, StoryObj } from "@storybook/nextjs";

import { nullGovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "./GovernanceSummary";

const meta = {
  title: "governance/GovernanceSummary",
  component: GovernanceSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof GovernanceSummary>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof GovernanceSummary>]?: React.ComponentProps<typeof GovernanceSummary>[K];
}>;

export const Default: Story = {
  args: {
    governanceSummary: nullGovernanceSummaryInfo,
  },
};
