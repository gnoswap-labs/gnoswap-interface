import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

import { GnoswapContext } from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { nullGovernanceSummaryInfo } from "@repositories/governance";

import { SAMPLE_XGNS_APR_HISTORY, SAMPLE_XGNS_APR } from "./governance-apr-preview.fixtures";
import GovernanceSummary from "./GovernanceSummary";

/**
 * The summary only reads token metadata/prices for the community pool tooltip. This local
 * stand-in answers those queries with empty data so the story never calls an external API.
 */
const localTokenContext = {
  tokenRepository: {
    getTokens: async () => ({ tokens: [] }),
    getTokenPrices: async () => ({ data: [] }),
    getTokenByPath: async (path: string) => {
      throw new Error(`No local token metadata for ${path}`);
    },
  },
} as unknown as React.ContextType<typeof GnoswapContext>;

const meta = {
  title: "governance/GovernanceSummary",
  component: GovernanceSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    function WithLocalTokenData(Story) {
      const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
      return (
        <QueryClientProvider client={queryClient}>
          <GnoswapContext.Provider value={localTokenContext}>
            <Story />
          </GnoswapContext.Provider>
        </QueryClientProvider>
      );
    },
  ],
  args: {
    governanceSummary: nullGovernanceSummaryInfo,
    governanceCommunityPoolBalances: [],
    isLoading: false,
    onOpenVideoGuide: fn(),
  },
} satisfies Meta<typeof GovernanceSummary>;

export default meta;
type Story = StoryObj<typeof GovernanceSummary>;

export const Default: Story = {};

/** SAMPLE · local preview: the actual summary with representative xGNS APR values. */
export const SampleXgnsAPR: Story = {
  name: "Sample xGNS APR (SAMPLE · local preview)",
  args: {
    governanceSummary: {
      ...nullGovernanceSummaryInfo,
      delegationInfo: {
        totalDelegationAmount: "1234567000000",
        governanceDelegationAmount: "1200000000000",
        launchpadDelegationAmount: "34567000000",
      },
      delegatedRatio: "0.382",
      apy: SAMPLE_XGNS_APR.totalApr,
      protocolFeeApr: SAMPLE_XGNS_APR.protocolFeeApr,
      emissionApr: SAMPLE_XGNS_APR.emissionApr,
      communityPoolUsd: "1234567",
      aprHistory: SAMPLE_XGNS_APR_HISTORY,
    },
  },
};

export const Loading: Story = {
  args: { isLoading: true },
};
