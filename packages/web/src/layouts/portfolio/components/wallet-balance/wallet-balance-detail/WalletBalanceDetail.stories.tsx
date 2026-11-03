import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { SocialWalletProvider } from "@providers/social-wallet-provider/SocialWalletProvider";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail from "./WalletBalanceDetail";

const meta = {
  title: "wallet/WalletBalance/WalletBalanceDetail",
  component: WalletBalanceDetail,
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
} satisfies Meta<typeof WalletBalanceDetail>;

export default meta;
type Story = StoryObj<typeof WalletBalanceDetail>;

export const Default: Story = {
  args: {
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
    connected: true,
    positionSummary: { stakedUsd: "1.20", unstakedUsd: "1.30", stakedCount: 1, unstakedCount: 1 },
    claimAll: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};
