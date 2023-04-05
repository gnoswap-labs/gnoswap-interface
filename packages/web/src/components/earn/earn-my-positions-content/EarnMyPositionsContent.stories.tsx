import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import EarnMyPositionsContent from "./EarnMyPositionsContent";
import { MY_POSITIONS_STATUS } from "@containers/earn-my-positions-content-container/EarnMyPositionsContentContainer";
import EarnMyPositonsUnconnected from "@components/earn/earn-my-positions-unconnected/EarnMyPositonsUnconnected";
import EarnMyPositionNoLiquidity from "@components/earn/earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";

export default {
  title: "earn/EarnMyPositionsContent",
  component: EarnMyPositionsContent,
  argTypes: {
    status: {
      options: [
        MY_POSITIONS_STATUS.UN_CONNECTED,
        MY_POSITIONS_STATUS.NO_LIQUIDITY,
        MY_POSITIONS_STATUS.CARD_LIST,
      ],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof EarnMyPositionsContent>;

const Template: ComponentStory<typeof EarnMyPositionsContent> = args => (
  <EarnMyPositionsContent
    {...args}
    unconnected={<EarnMyPositonsUnconnected />}
    noLiquidity={<EarnMyPositionNoLiquidity />}
    cardList={<MyPositionCardListContainer />}
  />
);

export const Default = Template.bind({});
Default.args = {
  status: MY_POSITIONS_STATUS.UN_CONNECTED,
};
