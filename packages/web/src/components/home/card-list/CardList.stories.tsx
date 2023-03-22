import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CardList, { UpDownType } from "./CardList";
import styled from "@emotion/styled";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";

export default {
  title: "home/CardList",
  component: CardList,
} as ComponentMeta<typeof CardList>;

const trendingList = [
  {
    logo: "https://picsum.photos/id/237/20/20",
    name: "Bitcoin",
    content: "BTC",
    upDownType: UpDownType.DOWN,
    notationValue: "17.43%",
  },
  {
    logo: "https://picsum.photos/id/1/20/20",
    name: "Ethereum",
    content: "ETH",
    upDownType: UpDownType.UP,
    notationValue: "7.43%",
  },
  {
    logo: "https://picsum.photos/id/100/20/20",
    name: "Gnoland",
    content: "GNOT",
    upDownType: UpDownType.UP,
    notationValue: "47.43%",
  },
];

const highestList = [
  {
    logo: (
      <DoubleLogo
        left="https://picsum.photos/id/313/20/20"
        right="https://picsum.photos/id/218/20/20"
        size={20}
        overlap={6}
      />
    ),
    name: "Bitcoin",
    content: "BTC",
    upDownType: UpDownType.DOWN,
    notationValue: "17.43%",
  },
  {
    logo: (
      <DoubleLogo
        left="https://picsum.photos/id/313/20/20"
        right="https://picsum.photos/id/218/20/20"
        size={20}
        overlap={6}
      />
    ),
    name: "Ethereum",
    content: "ETH",
    upDownType: UpDownType.UP,
    notationValue: "7.43%",
  },
  {
    logo: (
      <DoubleLogo
        left="https://picsum.photos/id/12/20/20"
        right="https://picsum.photos/id/33/20/20"
        size={20}
        overlap={6}
      />
    ),
    name: "Gnoland",
    content: "GNOT",
    upDownType: UpDownType.UP,
    notationValue: "47.43%",
  },
];

const recentlyList = [
  {
    logo: "https://picsum.photos/id/54/20/20",
    name: "Bitcoin",
    content: "BTC",
    upDownType: UpDownType.DEFAULT,
    notationValue: "$1,423.42",
  },
  {
    logo: "https://picsum.photos/id/29/20/20",
    name: "Ethereum",
    content: "ETH",
    upDownType: UpDownType.DEFAULT,
    notationValue: "$14.22",
  },
  {
    logo: "https://picsum.photos/id/74/20/20",
    name: "Gnoland",
    content: "GNOT",
    upDownType: UpDownType.DEFAULT,
    notationValue: "$102.43",
  },
];

const Template: ComponentStory<typeof CardList> = () => {
  return (
    <CardWrap>
      <CardList title="Trending" list={trendingList} />
      <CardList title="Highest APRs" list={highestList} />
      <CardList title="Recently Added" list={recentlyList} />
    </CardWrap>
  );
};

export const Default = Template.bind({});
Default.args = {};

const CardWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  img {
    border-radius: 50%;
  }
`;
