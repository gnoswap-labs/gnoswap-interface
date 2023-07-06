import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CardList from "./CardList";
import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import { css } from "@emotion/react";
import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { highestList, recentlyList, trendingList } from "./card-list-dummy";

export default {
  title: "home/CardList",
  component: CardList,
} as ComponentMeta<typeof CardList>;

const Template: ComponentStory<typeof CardList> = () => {
  return (
    <div css={wrapper}>
      <TrendingCardList list={trendingList} />
      <HighestAprsCardList list={highestList} />
      <RecentlyAddedCardList list={recentlyList} />
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
