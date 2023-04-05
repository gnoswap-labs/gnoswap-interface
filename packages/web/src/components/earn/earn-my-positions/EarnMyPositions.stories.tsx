import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositions from "./EarnMyPositions";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import EarnMyPositionsHeader from "@components/earn/earn-my-positions-header/EarnMyPositionsHeader";
import EarnMyPositonsUnconnected from "@components/earn/earn-my-positions-unconnected/EarnMyPositonsUnconnected";
import EarnMyPositionNoLiquidity from "@components/earn/earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsContentContainer from "@containers/earn-my-positions-content-container/EarnMyPositionsContentContainer";

export default {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
} as ComponentMeta<typeof EarnMyPositions>;

const Template: ComponentStory<typeof EarnMyPositions> = args => (
  <EarnMyPositions
    {...args}
    header={<EarnMyPositionsHeader />}
    content={
      <EarnMyPositionsContentContainer
        unconnected={<EarnMyPositonsUnconnected />}
        noLiquidity={<EarnMyPositionNoLiquidity />}
        cardList={<MyPositionCardListContainer />}
      />
    }
  />
);

export const Default = Template.bind({});
Default.args = {};
