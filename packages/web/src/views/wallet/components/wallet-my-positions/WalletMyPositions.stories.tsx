import { ComponentMeta, ComponentStory } from "@storybook/react";

import WalletPositionCardListContainer from "../../containers/wallet-position-card-list-container/WalletPositionCardListContainer";
import WalletMyPositionsHeader from "../wallet-my-positions-header/WalletMyPositionsHeader";
import WalletMyPositions from "./WalletMyPositions";

export default {
  title: "wallet/WalletMyPositions",
  component: WalletMyPositions,
} as ComponentMeta<typeof WalletMyPositions>;

const Template: ComponentStory<typeof WalletMyPositions> = args => (
  <WalletMyPositions
    {...args}
    header={<WalletMyPositionsHeader />}
    cardList={<WalletPositionCardListContainer />}
  />
);

export const Default = Template.bind({});
Default.args = {};
