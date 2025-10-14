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
type Story = StoryObj<typeof WalletMyPositions>;

export const Default: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    header: <WalletMyPositionsHeader isClosed={true} toggleClosed={() => {}} />,
    cardList: <WalletPositionCardListContainer isClosed={true} />,
  },
};
