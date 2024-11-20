import { DexEvent, DexEventType } from "@repositories/common";

export type ActivityResponse = ActivityData[];

export interface ActivityData {
  txHash: string;
  actionType: DexEventType;
  tokenA: OnchainToken;
  tokenB: OnchainToken;
  tokenAAmount: string;
  tokenBAmount: string;
  totalUsd: string;
  usedTokens?: number;
  account: string;
  time: string;
}

export interface OnchainToken {
  type: string;
  chainId: string;
  createdAt: string;
  name: string;
  path: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  priceID: string;
}

export const dummyActivityData: ActivityData = {
  txHash: "hNaBGE2oDb15Q08y68wpycjwwGaCcXcU2jnrRRfuUo0%3D",
  actionType: DexEvent.ADD,
  tokenA: {
    type: "grc20",
    chainId: "dev",
    createdAt: "",
    name: "gnoland",
    path: "gnot",
    decimals: 6,
    symbol: "GNOT",
    logoURI: "",
    priceID: "gnot",
  },
  tokenB: {
    type: "grc20",
    chainId: "dev",
    createdAt: "",
    name: "gnoland",
    path: "gnot",
    decimals: 6,
    symbol: "GNOT",
    logoURI: "",
    priceID: "gnot",
  },
  tokenAAmount: "100",
  tokenBAmount: "10",
  totalUsd: "1000",
  usedTokens: 2,
  account: "",
  time: "",
};
