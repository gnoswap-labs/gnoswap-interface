import type { Meta, StoryObj } from "@storybook/nextjs";

import TrendingCryptos from "./TrendingCryptos";
import TrendingCryptoCardListContainer from "../../containers/trending-crypto-card-list-container/TrendingCryptoCardListContainer";

const meta = {
  title: "token/TrendingCryptos",
  component: TrendingCryptos,
  tags: ["autodocs"],
} satisfies Meta<typeof TrendingCryptos>;

export default meta;
type Story = StoryObj<typeof TrendingCryptos>;

export const Default: Story = {
  args: {
    cardList: <TrendingCryptoCardListContainer />,
  },
};
