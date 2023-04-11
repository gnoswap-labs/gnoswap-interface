import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositions from "./EarnMyPositions";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import EarnMyPositionsHeader from "@components/earn/earn-my-positions-header/EarnMyPositionsHeader";
import EarnMyPositonsUnconnected from "@components/earn/earn-my-positions-unconnected/EarnMyPositonsUnconnected";
import EarnMyPositionNoLiquidity from "@components/earn/earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsContent, {
  MY_POSITIONS_STATUS,
} from "@components/earn/earn-my-positions-content/EarnMyPositionsContent";

export default {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
} as ComponentMeta<typeof EarnMyPositions>;

const Template: ComponentStory<typeof EarnMyPositions> = args => (
  <EarnMyPositions {...args} header={<EarnMyPositionsHeader />} />
);

export const UnConnected = Template.bind({});
UnConnected.args = {
  content: (
    <EarnMyPositionsContent
      unconnected={<EarnMyPositonsUnconnected />}
      noLiquidity={<EarnMyPositionNoLiquidity />}
      cardList={<MyPositionCardListContainer />}
      status={MY_POSITIONS_STATUS.UN_CONNECTED}
    />
  ),
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  content: (
    <EarnMyPositionsContent
      unconnected={<EarnMyPositonsUnconnected />}
      noLiquidity={<EarnMyPositionNoLiquidity />}
      cardList={<MyPositionCardListContainer />}
      status={MY_POSITIONS_STATUS.NO_LIQUIDITY}
    />
  ),
};

export const CardList = Template.bind({});
CardList.args = {
  content: (
    <EarnMyPositionsContent
      unconnected={<EarnMyPositonsUnconnected />}
      noLiquidity={<EarnMyPositionNoLiquidity />}
      cardList={<MyPositionCardListContainer />}
      status={MY_POSITIONS_STATUS.CARD_LIST}
    />
  ),
};
