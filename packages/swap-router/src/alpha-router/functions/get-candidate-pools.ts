import _ from "lodash";
import { AlphaRouterConfig } from "../alpha-router";
import { ChainId, Token, TradeType } from "../core";
import { ITokenProvider, IV3PoolProvider, V3PoolAccessor } from "../providers";
import { Protocol } from "../router-sdk";
import { WRAPPED_NATIVE_CURRENCY } from "../utility";
import { Pool } from "../v3-sdk";

export type PoolId = { id: string };
export type CandidatePoolsBySelectionCriteria = {
  protocol: Protocol;
  selections: CandidatePoolsSelections;
};

/// Utility type for allowing us to use `keyof CandidatePoolsSelections` to map
export type CandidatePoolsSelections = {
  topByBaseWithTokenIn: PoolId[];
  topByBaseWithTokenOut: PoolId[];
  topByDirectSwapPool: PoolId[];
  topByGnotQuoteTokenPool: PoolId[];
  topByTVL: PoolId[];
  topByTVLUsingTokenIn: PoolId[];
  topByTVLUsingTokenOut: PoolId[];
  topByTVLUsingTokenInSecondHops: PoolId[];
  topByTVLUsingTokenOutSecondHops: PoolId[];
};

export type V3GetCandidatePoolsParams = {
  tokenIn: Token;
  tokenOut: Token;
  routeType: TradeType;
  routingConfig: AlphaRouterConfig;
  tokenProvider: ITokenProvider;
  poolProvider: IV3PoolProvider;
  chainId: ChainId;
};

const GNOT = new Token(
  ChainId.MAINNET,
  "gno.land/r/demo/wugnot",
  6,
  "GNOT",
  "GNOT",
);

const baseTokensByChain: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: [GNOT],
  [ChainId.TEST3]: [GNOT],
  [ChainId.BETA_GNOSWAP]: [GNOT],
  [ChainId.DEV_GNOSWAP]: [GNOT],
};

export type V3CandidatePools = {
  poolAccessor: V3PoolAccessor;
  candidatePools: CandidatePoolsBySelectionCriteria;
  pools: Pool[];
};

export async function getV3CandidatePools({
  tokenIn,
  tokenOut,
  routeType,
  routingConfig,
  tokenProvider,
  poolProvider,
  chainId,
}: V3GetCandidatePoolsParams): Promise<V3CandidatePools> {
  const {
    blockNumber,
    v3PoolSelection: {
      topN,
      topNDirectSwaps,
      topNTokenInOut,
      topNSecondHop,
      topNSecondHopForTokenAddress,
      tokensToAvoidOnSecondHops,
      topNWithEachBaseToken,
      topNWithBaseToken,
    },
  } = routingConfig;
  const tokenInAddress = tokenIn.address.toLowerCase();
  const tokenOutAddress = tokenOut.address.toLowerCase();

  const allPools = (await poolProvider.getPools()).getAllPools();

  // Only consider pools where neither tokens are in the blocked token list.
  let filteredPools: Pool[] = allPools;
  // if (blockedTokenListProvider) {
  //   filteredPools = [];
  //   for (const pool of allPools) {
  //     const token0InBlocklist = await blockedTokenListProvider.hasTokenByAddress(
  //       pool.token0.address,
  //     );
  //     const token1InBlocklist = await blockedTokenListProvider.hasTokenByAddress(
  //       pool.token1.address,
  //     );

  //     if (token0InBlocklist || token1InBlocklist) {
  //       continue;
  //     }

  //     filteredPools.push(pool);
  //   }
  // }

  // Sort by tvlUSD in descending order
  const subgraphPoolsSorted = filteredPools.sort((a, b) => b.tvlUSD - a.tvlUSD);

  const poolAddressesSoFar = new Set<string>();
  const addToAddressSet = (pools: Pool[]) => {
    _(pools)
      .map(pool => "pool.path")
      .forEach(poolAddress => poolAddressesSoFar.add(poolAddress));
  };

  const baseTokens = baseTokensByChain[chainId] ?? [];

  const topByBaseWithTokenIn = _(baseTokens)
    .flatMap((token: Token) => {
      return _(subgraphPoolsSorted)
        .filter(subgraphPool => {
          const tokenAddress = token.address.toLowerCase();
          return (
            (subgraphPool.token0.address == tokenAddress &&
              subgraphPool.token1.address == tokenInAddress) ||
            (subgraphPool.token1.address == tokenAddress &&
              subgraphPool.token0.address == tokenInAddress)
          );
        })
        .sortBy(tokenListPool => -tokenListPool.tvlUSD)
        .slice(0, topNWithEachBaseToken)
        .value();
    })
    .sortBy(tokenListPool => -tokenListPool.tvlUSD)
    .slice(0, topNWithBaseToken)
    .value();

  const topByBaseWithTokenOut = _(baseTokens)
    .flatMap((token: Token) => {
      return _(subgraphPoolsSorted)
        .filter(subgraphPool => {
          const tokenAddress = token.address.toLowerCase();
          return (
            (subgraphPool.token0.address == tokenAddress &&
              subgraphPool.token1.address == tokenOutAddress) ||
            (subgraphPool.token1.address == tokenAddress &&
              subgraphPool.token0.address == tokenOutAddress)
          );
        })
        .sortBy(tokenListPool => -tokenListPool.tvlUSD)
        .slice(0, topNWithEachBaseToken)
        .value();
    })
    .sortBy(tokenListPool => -tokenListPool.tvlUSD)
    .slice(0, topNWithBaseToken)
    .value();

  let top2DirectSwapPool = _(subgraphPoolsSorted)
    .filter(subgraphPool => {
      return (
        !poolAddressesSoFar.has(subgraphPool.path) &&
        ((subgraphPool.token0.address == tokenInAddress &&
          subgraphPool.token1.address == tokenOutAddress) ||
          (subgraphPool.token1.address == tokenInAddress &&
            subgraphPool.token0.address == tokenOutAddress))
      );
    })
    .slice(0, topNDirectSwaps)
    .value();

  addToAddressSet(top2DirectSwapPool);

  const wrappedNativeAddress = WRAPPED_NATIVE_CURRENCY[
    chainId
  ]?.address.toLowerCase();

  // Main reason we need this is for gas estimates, only needed if token out is not native.
  // We don't check the seen address set because if we've already added pools for getting native quotes
  // theres no need to add more.
  let top2GnotQuoteTokenPool: Pool[] = [];
  if (
    WRAPPED_NATIVE_CURRENCY[chainId]?.symbol ==
      WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET]?.symbol &&
    tokenOut.symbol != "WGNOT" &&
    tokenOut.symbol != "GNOT"
  ) {
    top2GnotQuoteTokenPool = _(subgraphPoolsSorted)
      .filter(subgraphPool => {
        if (routeType == TradeType.EXACT_INPUT) {
          return (
            (subgraphPool.token0.address == wrappedNativeAddress &&
              subgraphPool.token1.address == tokenOutAddress) ||
            (subgraphPool.token1.address == wrappedNativeAddress &&
              subgraphPool.token0.address == tokenOutAddress)
          );
        } else {
          return (
            (subgraphPool.token0.address == wrappedNativeAddress &&
              subgraphPool.token1.address == tokenInAddress) ||
            (subgraphPool.token1.address == wrappedNativeAddress &&
              subgraphPool.token0.address == tokenInAddress)
          );
        }
      })
      .slice(0, 1)
      .value();
  }

  addToAddressSet(top2GnotQuoteTokenPool);

  const topByTVL = _(subgraphPoolsSorted)
    .filter(subgraphPool => {
      return !poolAddressesSoFar.has(subgraphPool.path);
    })
    .slice(0, topN)
    .value();

  addToAddressSet(topByTVL);

  const topByTVLUsingTokenIn = _(subgraphPoolsSorted)
    .filter(subgraphPool => {
      return (
        !poolAddressesSoFar.has(subgraphPool.path) &&
        (subgraphPool.token0.address == tokenInAddress ||
          subgraphPool.token1.address == tokenInAddress)
      );
    })
    .slice(0, topNTokenInOut)
    .value();

  addToAddressSet(topByTVLUsingTokenIn);

  const topByTVLUsingTokenOut = _(subgraphPoolsSorted)
    .filter(subgraphPool => {
      return (
        !poolAddressesSoFar.has(subgraphPool.path) &&
        (subgraphPool.token0.address == tokenOutAddress ||
          subgraphPool.token1.address == tokenOutAddress)
      );
    })
    .slice(0, topNTokenInOut)
    .value();

  addToAddressSet(topByTVLUsingTokenOut);

  const topByTVLUsingTokenInSecondHops = _(topByTVLUsingTokenIn)
    .map(subgraphPool => {
      return tokenInAddress == subgraphPool.token0.address
        ? subgraphPool.token1.address
        : subgraphPool.token0.address;
    })
    .flatMap((secondHopId: string) => {
      return _(subgraphPoolsSorted)
        .filter(subgraphPool => {
          return (
            !poolAddressesSoFar.has(subgraphPool.path) &&
            !tokensToAvoidOnSecondHops?.includes(secondHopId.toLowerCase()) &&
            (subgraphPool.token0.address == secondHopId ||
              subgraphPool.token1.address == secondHopId)
          );
        })
        .slice(
          0,
          topNSecondHopForTokenAddress?.get(secondHopId) ?? topNSecondHop,
        )
        .value();
    })
    .uniqBy(pool => pool.path)
    .value();

  addToAddressSet(topByTVLUsingTokenInSecondHops);

  const topByTVLUsingTokenOutSecondHops = _(topByTVLUsingTokenOut)
    .map(subgraphPool => {
      return tokenOutAddress == subgraphPool.token0.address
        ? subgraphPool.token1.address
        : subgraphPool.token0.address;
    })
    .flatMap((secondHopId: string) => {
      return _(subgraphPoolsSorted)
        .filter(subgraphPool => {
          return (
            !poolAddressesSoFar.has(subgraphPool.path) &&
            !tokensToAvoidOnSecondHops?.includes(secondHopId.toLowerCase()) &&
            (subgraphPool.token0.address == secondHopId ||
              subgraphPool.token1.address == secondHopId)
          );
        })
        .slice(
          0,
          topNSecondHopForTokenAddress?.get(secondHopId) ?? topNSecondHop,
        )
        .value();
    })
    .uniqBy(pool => pool.path)
    .value();

  addToAddressSet(topByTVLUsingTokenOutSecondHops);

  const pools = _([
    ...topByBaseWithTokenIn,
    ...topByBaseWithTokenOut,
    ...top2DirectSwapPool,
    ...top2GnotQuoteTokenPool,
    ...topByTVL,
    ...topByTVLUsingTokenIn,
    ...topByTVLUsingTokenOut,
    ...topByTVLUsingTokenInSecondHops,
    ...topByTVLUsingTokenOutSecondHops,
  ])
    .compact()
    .uniqBy(pool => pool.path)
    .value();

  const poolAccessor = await poolProvider.getPools();

  const poolsBySelection: CandidatePoolsBySelectionCriteria = {
    protocol: Protocol.V3,
    selections: {
      topByBaseWithTokenIn: mapIdByPools(topByBaseWithTokenIn),
      topByBaseWithTokenOut: mapIdByPools(topByBaseWithTokenOut),
      topByDirectSwapPool: mapIdByPools(top2DirectSwapPool),
      topByGnotQuoteTokenPool: mapIdByPools(top2GnotQuoteTokenPool),
      topByTVL: mapIdByPools(topByTVL),
      topByTVLUsingTokenIn: mapIdByPools(topByTVLUsingTokenIn),
      topByTVLUsingTokenOut: mapIdByPools(topByTVLUsingTokenOut),
      topByTVLUsingTokenInSecondHops: mapIdByPools(
        topByTVLUsingTokenInSecondHops,
      ),
      topByTVLUsingTokenOutSecondHops: mapIdByPools(
        topByTVLUsingTokenOutSecondHops,
      ),
    },
  };

  return { poolAccessor, candidatePools: poolsBySelection, pools };
}

function mapIdByPools(pools: Pool[]): PoolId[] {
  return pools.map(p => ({ id: p.path }));
}
