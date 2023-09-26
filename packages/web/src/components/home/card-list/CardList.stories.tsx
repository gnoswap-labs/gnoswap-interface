import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CardList from "./CardList";
import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import { css } from "@emotion/react";
import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { DEVICE_TYPE } from "@styles/media";
import { action } from "@storybook/addon-actions";

export default {
  title: "home/CardList",
  component: CardList,
} as ComponentMeta<typeof CardList>;

const Template: ComponentStory<typeof CardList> = () => {
  return (
    <div css={wrapper}>
      <TrendingCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={action("click")} />
      <HighestAprsCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={action("click")} />
      <RecentlyAddedCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={action("click")} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

const wrapper = css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
`;
