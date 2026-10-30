import type { Meta, StoryObj } from "@storybook/nextjs";

import GovernanceAPRHistory from "./GovernanceAPRHistory";
import { SAMPLE_XGNS_APR_HISTORY } from "./governance-apr-preview.fixtures";

const meta = {
  title: "governance/GovernanceAPRHistory",
  component: GovernanceAPRHistory,
  parameters: { layout: "centered" },
  args: {
    days: SAMPLE_XGNS_APR_HISTORY,
    dateLabel: "Date",
    dailyAprLabel: "Total",
    feeLabel: "Fees",
    emissionLabel: "Emission",
    unavailableLabel: "Not available",
    locale: "en-US",
  },
} satisfies Meta<typeof GovernanceAPRHistory>;

export default meta;
type Story = StoryObj<typeof GovernanceAPRHistory>;

export const SampleDailyHistory: Story = {};

export const MissingComponents: Story = {
  args: { days: [{ date: "2026-10-29", apr: "12.34", estimated: false }] },
};
