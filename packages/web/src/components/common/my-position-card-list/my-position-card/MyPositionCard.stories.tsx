import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPositionCard from "./MyPositionCard";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { SocialWalletProvider } from "@providers/social-wallet-provider/SocialWalletProvider";

const meta = {
  title: "common/MyPositionCard",
  component: MyPositionCard,
  tags: ["autodocs"],
  decorators: [
    function WithPositionServices(Story) {
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
} satisfies Meta<typeof MyPositionCard>;

export default meta;
type Story = StoryObj<typeof MyPositionCard>;

export const Staked: Story = {
  args: {},
};

export const Unstaked: Story = {
  args: {
    movePoolDetail: fn(),
  },
};
