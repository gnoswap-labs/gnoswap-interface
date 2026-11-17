import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPositionCardList from "./MyPositionCardList";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import GnoswapServiceProvider from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { SocialWalletProvider } from "@providers/social-wallet-provider/SocialWalletProvider";

const meta = {
  title: "common/MyPositionCardList",
  component: MyPositionCardList,
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
  argTypes: {
    isFetched: {
      options: [true, false],
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof MyPositionCardList>;

export default meta;
type Story = StoryObj<typeof MyPositionCardList>;

export const Default: Story = {
  args: {
    positions: [],
    isFetched: true,
    currentIndex: 1,
    mobile: false,
    loadMore: true,
    movePoolDetail: fn(),
    onClickLoadMore: fn(),
  },
};
