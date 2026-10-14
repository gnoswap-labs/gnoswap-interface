import type { Meta, StoryObj } from "@storybook/nextjs";

import Tooltip from "@components/common/tooltip/Tooltip";

import GovernanceAPRHistory from "./GovernanceAPRHistory";

const meta = {
  title: "governance/GovernanceAPRHistory",
  component: GovernanceAPRHistory,
  parameters: { layout: "centered" },
} satisfies Meta<typeof GovernanceAPRHistory>;

export default meta;
type Story = StoryObj<typeof GovernanceAPRHistory>;

export const Hover: Story = {
  args: {
    average: "5.84",
    dateLabel: "Date",
    dailyAprLabel: "APR (1D)",
    comparisonLabel: "vs 7D avg",
    locale: "en-US",
    days: [
      { date: "2026-10-14", apr: "6.02", estimated: true, asOf: "2026-10-14T09:00:00Z" },
      { date: "2026-10-13", apr: "5.95", estimated: false },
      { date: "2026-10-12", apr: "5.80", estimated: false },
      { date: "2026-10-11", apr: "5.71", estimated: false },
      { date: "2026-10-10", apr: "5.66", estimated: false },
      { date: "2026-10-09", apr: "5.84", estimated: false },
      { date: "2026-10-08", apr: "5.90", estimated: false },
    ],
  },
  render: args => (
    <Tooltip placement="top" interactive FloatingContent={<GovernanceAPRHistory {...args} />}>
      <button type="button">5.84%</button>
    </Tooltip>
  ),
};
