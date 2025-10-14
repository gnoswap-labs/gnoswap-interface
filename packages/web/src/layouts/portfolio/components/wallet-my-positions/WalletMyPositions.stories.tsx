import type { Meta, StoryObj } from "@storybook/nextjs";

import WalletPositionCardListContainer from "../../containers/wallet-position-card-list-container/WalletPositionCardListContainer";
import WalletMyPositionsHeader from "../wallet-my-positions-header/WalletMyPositionsHeader";
import WalletMyPositions from "./WalletMyPositions";

const meta = {
  title: "wallet/WalletMyPositions",
  component: WalletMyPositions,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletMyPositions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: <WalletMyPositionsHeader isClosed={true} toggleClosed={() => {}} />,
    cardList: <WalletPositionCardListContainer isClosed={true} />,
  },
};
