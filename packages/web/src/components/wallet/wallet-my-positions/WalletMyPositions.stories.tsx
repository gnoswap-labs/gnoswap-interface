import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletMyPositionsHeader from "@components/wallet/wallet-my-positions-header/WalletMyPositionsHeader";
import WalletPositionCardListContainer from "@containers/wallet-position-card-list-container/WalletPositionCardListContainer";

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
