import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositions from "./EarnMyPositions";
import MyPositionCardListContainer from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import EarnMyPositionsHeader from "@components/earn/earn-my-positions-header/EarnMyPositionsHeader";

export default {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
} as ComponentMeta<typeof EarnMyPositions>;

const Template: ComponentStory<typeof EarnMyPositions> = args => (
  <EarnMyPositions
    {...args}
    header={<EarnMyPositionsHeader />}
    cardList={<MyPositionCardListContainer loadMore={true} />}
  />
);

export const Default = Template.bind({});
Default.args = {};
