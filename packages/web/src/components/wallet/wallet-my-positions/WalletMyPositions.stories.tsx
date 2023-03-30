import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletMyPositions from "./WalletMyPositions";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import WalletMyPositionsHeader from "@components/wallet/wallet-my-positions-header/WalletMyPositionsHeader";

export default {
  title: "wallet/WalletMyPositions",
  component: WalletMyPositions,
} as ComponentMeta<typeof WalletMyPositions>;

const Template: ComponentStory<typeof WalletMyPositions> = args => (
  <WalletMyPositions
    {...args}
    header={<WalletMyPositionsHeader />}
    cardList={<MyPositionCardListContainer loadMore={false} />}
  />
);

export const Default = Template.bind({});
Default.args = {};
