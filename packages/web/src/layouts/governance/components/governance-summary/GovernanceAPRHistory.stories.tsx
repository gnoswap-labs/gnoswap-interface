import type { Meta, StoryObj } from "@storybook/nextjs";

import GovernanceAPRHistory from "./GovernanceAPRHistory";
import { getSampleUtcDate, SAMPLE_XGNS_APR_HISTORY } from "./governance-apr-preview.fixtures";

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

/** Dates without API data stay in the fixed seven-day window as an em dash; nothing is averaged or zero-filled. */
export const MissingDates: Story = {
  args: {
    days: SAMPLE_XGNS_APR_HISTORY.filter((_, daysAgo) => daysAgo !== 1 && daysAgo !== 2 && daysAgo !== 5),
  },
};

export const ActualZero: Story = {
  args: {
    days: [{ date: getSampleUtcDate(0), apr: "0", protocolFeeApr: "0", emissionApr: "0", estimated: false }],
  },
};

export const MissingComponents: Story = {
  args: { days: [{ date: getSampleUtcDate(0), apr: "12.34", estimated: false }] },
};
