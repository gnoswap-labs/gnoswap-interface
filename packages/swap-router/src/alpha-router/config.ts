import { AlphaRouterConfig } from "./alpha-router";
import { ChainId } from "./core";

export const DEFAULT_ROUTING_CONFIG_BY_CHAIN = (
  chainId: ChainId,
): AlphaRouterConfig => {
  switch (chainId) {
    default:
      return {
        v3PoolSelection: {
          topN: 2,
          topNDirectSwaps: 2,
          topNTokenInOut: 3,
          topNSecondHop: 1,
          topNWithEachBaseToken: 3,
          topNWithBaseToken: 5,
        },
        maxSwapsPerPath: 3,
        minSplits: 1,
        maxSplits: 7,
        distributionPercent: 5,
        forceCrossProtocol: false,
      };
  }
};
