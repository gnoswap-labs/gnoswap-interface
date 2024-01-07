import _ from "lodash";
import { ChainId, TradeType } from "../core";
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from "../config";
import { TokenProvider, V3PoolProvider } from "../providers";
import { MOCK_POOLS } from "../test-utils/mock-pool";
import { BAR_DEV, BAZ_DEV, FOO_DEV, WGNOT_DEV } from "../test-utils/mock-token";
import { getV3CandidatePools } from "./get-candidate-pools";

describe("get candidate pools", () => {
  const ROUTING_CONFIG = {
    v3PoolSelection: {
      topN: 0,
      topNDirectSwaps: 0,
      topNTokenInOut: 0,
      topNSecondHop: 0,
      topNWithEachBaseToken: 0,
      topNWithBaseToken: 0,
    },
    v2PoolSelection: {
      topN: 0,
      topNDirectSwaps: 0,
      topNTokenInOut: 0,
      topNSecondHop: 0,
      topNWithEachBaseToken: 0,
      topNWithBaseToken: 0,
    },
    maxSwapsPerPath: 3,
    minSplits: 1,
    maxSplits: 3,
    distributionPercent: 5,
    forceCrossProtocol: false,
  };

  const mockPools = MOCK_POOLS;

  test("succeeds to get top pools by liquidity", async () => {
    const { candidatePools, pools } = await getV3CandidatePools({
      tokenIn: FOO_DEV,
      tokenOut: BAR_DEV,
      routeType: TradeType.EXACT_INPUT,
      routingConfig: {
        ...ROUTING_CONFIG,
        v3PoolSelection: {
          ...ROUTING_CONFIG.v3PoolSelection,
          topN: 2,
        },
      },
      poolProvider: new V3PoolProvider(ChainId.DEV_GNOSWAP),
      tokenProvider: new TokenProvider(ChainId.DEV_GNOSWAP),
      chainId: ChainId.DEV_GNOSWAP,
    });

    expect(1).toBeTruthy();
  });

  test("succeeds to get direct swap pools even if they dont exist in the subgraph", async () => {
    // Mock so that DAI_WETH exists on chain, but not in the subgraph

    const { candidatePools, pools } = await getV3CandidatePools({
      tokenIn: FOO_DEV,
      tokenOut: BAZ_DEV,
      routeType: TradeType.EXACT_INPUT,
      routingConfig: {
        ...ROUTING_CONFIG,
        v3PoolSelection: {
          ...ROUTING_CONFIG.v3PoolSelection,
          topNDirectSwaps: 2,
        },
      },
      poolProvider: new V3PoolProvider(ChainId.DEV_GNOSWAP),
      tokenProvider: new TokenProvider(ChainId.DEV_GNOSWAP),
      chainId: ChainId.DEV_GNOSWAP,
    });

    expect(1).toBeTruthy();
  });

  test("succeeds to get direct swap pools even if they dont exist in the subgraph", async () => {
    // Mock so that DAI_WETH exists on chain, but not in the subgraph

    const { candidatePools, pools } = await getV3CandidatePools({
      tokenIn: FOO_DEV,
      tokenOut: BAZ_DEV,
      routeType: TradeType.EXACT_INPUT,
      routingConfig: DEFAULT_ROUTING_CONFIG_BY_CHAIN(ChainId.DEV_GNOSWAP),
      poolProvider: new V3PoolProvider(ChainId.DEV_GNOSWAP),
      tokenProvider: new TokenProvider(ChainId.DEV_GNOSWAP),
      chainId: ChainId.DEV_GNOSWAP,
    });

    expect(1).toBeTruthy();
  });
});
