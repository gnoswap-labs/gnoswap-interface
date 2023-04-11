import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import EarnMyPositionsContent, {
  MY_POSITIONS_STATUS,
} from "./EarnMyPositionsContent";
import EarnMyPositonsUnconnected from "@components/earn/earn-my-positions-unconnected/EarnMyPositonsUnconnected";
import EarnMyPositionNoLiquidity from "@components/earn/earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";

export default {
  title: "earn/EarnMyPositionsContent",
  component: EarnMyPositionsContent,
} as ComponentMeta<typeof EarnMyPositionsContent>;

const Template: ComponentStory<typeof EarnMyPositionsContent> = args => (
  <EarnMyPositionsContent
    {...args}
    unconnected={<EarnMyPositonsUnconnected />}
    noLiquidity={<EarnMyPositionNoLiquidity />}
    cardList={<MyPositionCardListContainer />}
  />
);

export const UnConnected = Template.bind({});
UnConnected.args = {
  status: MY_POSITIONS_STATUS.UN_CONNECTED,
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  status: MY_POSITIONS_STATUS.NO_LIQUIDITY,
};

export const CardList = Template.bind({});
CardList.args = {
  status: MY_POSITIONS_STATUS.CARD_LIST,
};
