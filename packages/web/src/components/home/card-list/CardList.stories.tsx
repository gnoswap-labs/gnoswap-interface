import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { css } from "@emotion/react";

import CardList from "./CardList";
import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import HighestAprsCardList from "@components/home/highest-aprs-card-list/HighestAprsCardList";
import RecentlyAddedCardList from "@components/home/recently-added-card-list/RecentlyAddedCardList";
import { DEVICE_TYPE } from "@styles/media";

const meta = {
  title: "home/CardList",
  component: CardList,
  tags: ["autodocs"],
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof CardList>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof CardList>[K];
}>;

export const Default: Story = {
  render: () => (
    <div css={wrapper}>
      <TrendingCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={fn()} loading={false} />
      <HighestAprsCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={fn()} loading={false} />
      <RecentlyAddedCardList list={[]} device={DEVICE_TYPE.WEB} onClickItem={fn()} loading={false} />
    </div>
  ),
};

const wrapper = css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
`;
