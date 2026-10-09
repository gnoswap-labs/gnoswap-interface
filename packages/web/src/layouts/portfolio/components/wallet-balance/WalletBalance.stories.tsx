import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { SocialWalletProvider } from "@providers/social-wallet-provider/SocialWalletProvider";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalance from "./WalletBalance";

const meta = {
  title: "wallet/WalletBalance",
  component: WalletBalance,
  tags: ["autodocs"],
  args: { tokens: [], tokenPrices: {}, positionRewards: null, isSwitchNetwork: false, loadngTransactionClaim: false },
  decorators: [
    function WithWalletServices(Story) {
      const [queryClient] = useState(() => new QueryClient());
      return (
        <QueryClientProvider client={queryClient}>
          <GnoswapServiceProvider>
            <SocialWalletProvider>
              <Story />
            </SocialWalletProvider>
          </GnoswapServiceProvider>
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof WalletBalance>;

export default meta;
type Story = StoryObj<typeof WalletBalance>;

export const ConnectionSucceeded: Story = {
  args: {
    connected: true,
    positionSummary: { stakedUsd: "1.20", unstakedUsd: "1.30", stakedCount: 1, unstakedCount: 1 },
    balanceSummaryInfo: {
      amount: "$1,000.00",
      changeRate: "+1.1%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$1.10",
      stakedLP: "$1.20",
      unstakedLP: "$1.30",
      claimableRewards: "$1.40",
      loadingBalance: false,
      loadingPositions: false,
      loadingRewards: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
    claimAll: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const ConnectionFailed: Story = {
  args: {
    connected: false,
    positionSummary: null,
    balanceSummaryInfo: {
      amount: "$0.00",
      changeRate: "+0%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$0.00",
      stakedLP: "$0.00",
      unstakedLP: "$0.00",
      claimableRewards: "$0.00",
      loadingBalance: false,
      loadingPositions: false,
      loadingRewards: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
  },
};

export const LoadingData: Story = {
  args: {
    connected: true,
    positionSummary: null,
    balanceSummaryInfo: {
      amount: "$0.00",
      changeRate: "+0%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$0.00",
      stakedLP: "$0.00",
      unstakedLP: "$0.00",
      claimableRewards: "$0.00",
      loadingBalance: false,
      loadingPositions: false,
      loadingRewards: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
    claimAll: fn(),
  },
};
