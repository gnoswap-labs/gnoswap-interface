import { ListProps, UP_DOWN_TYPE } from "./CardList";

export const trendingList: ListProps[] = [
  {
    logo: "https://picsum.photos/id/237/20/20",
    name: "Bitcoin",
    content: "BTC",
    upDownType: UP_DOWN_TYPE.DOWN,
    notationValue: "17.43%",
    onClick: () => {},
  },
  {
    logo: "https://picsum.photos/id/1/20/20",
    name: "Ethereum",
    content: "ETH",
    upDownType: UP_DOWN_TYPE.UP,
    notationValue: "7.43%",
    onClick: () => {},
  },
  {
    logo: "https://picsum.photos/id/100/20/20",
    name: "Gnoland",
    content: "GNOT",
    upDownType: UP_DOWN_TYPE.UP,
    notationValue: "47.43%",
    onClick: () => {},
  },
];

export const highestList: ListProps[] = [
  {
    logo: [
      "https://picsum.photos/id/313/20/20",
      "https://picsum.photos/id/218/20/20",
    ],
    name: "GNOS/GNOT",
    content: "0.3%",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "148.07%",
    onClick: () => {},
  },
  {
    logo: [
      "https://picsum.photos/id/313/20/20",
      "https://picsum.photos/id/218/20/20",
    ],
    name: "BTC/GNOT",
    content: "0.3%",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "125.13%",
    onClick: () => {},
  },
  {
    logo: [
      "https://picsum.photos/id/12/20/20",
      "https://picsum.photos/id/33/20/20",
    ],
    name: "ATOM/GNOT",
    content: "0.3%",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "85.43%",
    onClick: () => {},
  },
];

export const recentlyList: ListProps[] = [
  {
    logo: "https://picsum.photos/id/54/20/20",
    name: "Bitcoin",
    content: "BTC",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "$1,423.42",
    onClick: () => {},
  },
  {
    logo: "https://picsum.photos/id/29/20/20",
    name: "Ethereum",
    content: "ETH",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "$14.22",
    onClick: () => {},
  },
  {
    logo: "https://picsum.photos/id/74/20/20",
    name: "Gnoland",
    content: "GNOT",
    upDownType: UP_DOWN_TYPE.NONE,
    notationValue: "$102.43",
    onClick: () => {},
  },
];
