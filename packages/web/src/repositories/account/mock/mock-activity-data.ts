import { TokenPairInfo } from "@models/token/token-pair-info";
import { ActivityData } from "@repositories/activity/responses/activity-responses";
import { DexEvent } from "@repositories/common/types";

export const mockTokenPairInfo: TokenPairInfo = {
  tokenA: { path: "gno.land/r/demo/gnot", name: "GNOT", symbol: "GNOT", displaySymbol: "GNOT", logoURI: "" },
  tokenB: { path: "gno.land/r/demo/gns", name: "GNS", symbol: "GNS", displaySymbol: "GNS", logoURI: "" },
};

export const mockActivityData: ActivityData = {
  txHash: "1",
  actionType: DexEvent.ADD_INCENTIVE,
  tokenA: {
    type: "grc20",
    chainId: "test",
    createdAt: "1900-01-01",
    name: "GNOT",
    path: "gno.land/r/demo/gnot",
    decimals: 6,
    symbol: "GNOT",
    displaySymbol: "GNOT",
    logoURI: "",
    priceID: "",
  },
  tokenB: {
    type: "grc20",
    chainId: "test",
    createdAt: "1900-01-01",
    name: "GNS",
    path: "gno.land/r/demo/gns",
    decimals: 6,
    symbol: "GNS",
    displaySymbol: "GNS",
    logoURI: "",
    priceID: "",
  },
  tokenAAmount: "0",
  tokenBAmount: "0",
  totalUsd: "0",
  account: "",
  time: "1900-01-01",
  success: true,
};
