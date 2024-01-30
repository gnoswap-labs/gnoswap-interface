import BigNumber from "bignumber.js";
import _ from "lodash";
import { ChainId, Token } from "../../core";
import { FeeAmount, Pool } from "../../v3-sdk";
import { mapPoolByResponse } from "../mapper/pool-mapper";

import { PoolResponse } from "../response/pool-response";

type ISlot0 = {
  sqrtPriceX96: BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
};

type ILiquidity = { liquidity: BigNumber };

/**
 * Provider or getting V3 pools.
 *
 * @export
 * @interface IV3PoolProvider
 */
export interface IV3PoolProvider {
  /**
   * Gets the specified pools.
   *
   * @param tokenPairs The token pairs and fee amount of the pools to get.
   * @param [providerConfig] The provider config.
   * @returns A pool accessor with methods for accessing the pools.
   */
  getPools(): Promise<V3PoolAccessor>;

  /**
   * Gets the pool address for the specified token pair and fee tier.
   *
   * @param tokenA Token A in the pool.
   * @param tokenB Token B in the pool.
   * @param feeAmount The fee amount of the pool.
   * @returns The pool address and the two tokens.
   */
  getPoolAddress(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ): { poolAddress: string; token0: Token; token1: Token };
}

export type IV3PoolAccessor = {
  getPool: (
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ) => Pool | undefined;
  getPoolByPath: (path: string) => Pool | undefined;
  getAllPools: () => Pool[];
};

export class V3PoolAccessor implements IV3PoolAccessor {
  poolMap: Record<string, Pool>;

  constructor(poolMap: Record<string, Pool>) {
    this.poolMap = poolMap;
  }

  getPool(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ): Pool | undefined {
    const path = `${tokenA.address}:${tokenB.address}:${feeAmount}`;
    return this.getPoolByPath(path);
  }

  getPoolByPath(path: string): Pool | undefined {
    return this.poolMap[path];
  }

  getAllPools(): Pool[] {
    return Object.values(this.poolMap);
  }
}

export class V3PoolProvider implements IV3PoolProvider {
  // Computing pool addresses is slow as it requires hashing, encoding etc.
  // Addresses never change so can always be cached.
  private POOL_ADDRESS_CACHE: { [key: string]: string } = {};

  private fetchUri: string;

  /**
   * Creates an instance of V3PoolProvider.
   * @param chainId The chain id to use.
   * @param multicall2Provider The multicall provider to use to get the pools.
   * @param retryOptions The retry options for each call to the multicall.
   */
  constructor(protected chainId: ChainId) {
    switch (chainId) {
      case ChainId.BETA_GNOSWAP:
        this.fetchUri = "https://beta.api.gnoswap.io/v3/testnet";
        break;
      default:
        this.fetchUri = "https://dev.api.gnoswap.io/v3/testnet";
    }
  }

  public async getPools(): Promise<V3PoolAccessor> {
    const pools = await this.fetchPools();
    const poolAddressToPool = pools.reduce<{
      [poolAddress: string]: Pool;
    }>((acc, pool) => {
      acc[pool.path] = pool;
      return acc;
    }, {});

    return new V3PoolAccessor(poolAddressToPool);
  }

  public getPoolAddress(
    tokenA: Token,
    tokenB: Token,
    feeAmount: FeeAmount,
  ): { poolAddress: string; token0: Token; token1: Token } {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    const cacheKey = `${this.chainId}/${token0.address}/${token1.address}/${feeAmount}`;

    const cachedAddress = this.POOL_ADDRESS_CACHE[cacheKey];

    if (cachedAddress) {
      return { poolAddress: cachedAddress, token0, token1 };
    }

    const poolAddress = `${token0.address}:${token1.address}:${feeAmount}`;

    this.POOL_ADDRESS_CACHE[cacheKey] = poolAddress;

    return { poolAddress, token0, token1 };
  }

  private async fetchPools(): Promise<Pool[]> {
    const requestUrl = this.fetchUri + "/pools";
    return fetch(requestUrl)
      .then(response => response.json())
      .then(json => (json.pools as PoolResponse[]).map(mapPoolByResponse))
      .catch(e => {
        console.log(e);
        return [];
      });
  }
}
