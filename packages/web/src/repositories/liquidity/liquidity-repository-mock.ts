import { LiquidityError } from "@common/errors/liquidity";
import { generateNumberPlus, generateTxHash } from "@common/utils/test-util";
import {
  AddLiquidityResponse,
  ClaimRewardResponse,
  LiquidityDetailInfoResponse,
  LiquidityDetailListResponse,
  LiquidityRepository,
  LiquidityRewardResponse,
  RemoveLiquidityResponse,
} from ".";

import LiquidityDatas from "./mock/liquidities.json";
import {
  PoolInfoResponse,
  PoolRepository,
  PoolRepositoryMock,
} from "@repositories/pool";

interface TokenResponse {
  token_id: string;
  name: string;
  symbol: string;
  amount: {
    value: number;
    denom: string;
  };
}

export class LiquidityRepositoryMock implements LiquidityRepository {
  private poolRepository: PoolRepository = new PoolRepositoryMock();

  public getLiquidityById = async (
    liquidityId: string,
  ): Promise<LiquidityDetailInfoResponse> => {
    const liquidities = await this.getLiquidityDetailInfos();
    const liquidity = liquidities.find(l => l.liquidity_id === liquidityId);
    if (!liquidity) {
      throw new LiquidityError("NOT_FOUND_LIQUIDITY");
    }
    return liquidity as LiquidityDetailInfoResponse;
  };

  public getLiquiditiesByAddress = async (
    address: string,
  ): Promise<LiquidityDetailListResponse> => {
    const liquidityInfos = await this.getLiquidityDetailInfos();
    const liquidities = liquidityInfos.filter(l => l.address === address);
    return {
      total: liquidities.length,
      hits: liquidities.length,
      liquidities: liquidities as Array<LiquidityDetailInfoResponse>,
    };
  };

  public getLiquiditiesByAddressAndPoolId = async (
    address: string,
    poolId: string,
  ): Promise<LiquidityDetailListResponse> => {
    const liquidityInfos = await this.getLiquidityDetailInfos();
    const liquidities = liquidityInfos.filter(
      l => l.address === address && l.pool_id === poolId,
    );
    return {
      total: liquidities.length,
      hits: liquidities.length,
      liquidities: liquidities as Array<LiquidityDetailInfoResponse>,
    };
  };

  public getAvailStakeLiquiditiesBy = async (
    poolId: string,
    address: string,
  ): Promise<LiquidityDetailListResponse> => {
    const liquidityInfos = await this.getLiquidityDetailInfos();
    const liquidities = liquidityInfos.filter(
      l => l.address === address && l.pool_id === poolId,
    );
    return {
      total: liquidities.length,
      hits: liquidities.length,
      liquidities: liquidities as Array<LiquidityDetailInfoResponse>,
    };
  };

  public getAvailUnstakeLiquiditiesBy = async (
    poolId: string,
    address: string,
  ): Promise<LiquidityDetailListResponse> => {
    const liquidityInfos = await this.getLiquidityDetailInfos();
    const liquidities = liquidityInfos.filter(
      l => l.address === address && l.pool_id === poolId,
    );
    return {
      total: liquidities.length,
      hits: liquidities.length,
      liquidities: liquidities as Array<LiquidityDetailInfoResponse>,
    };
  };

  public addLiquidityBy = async (): Promise<AddLiquidityResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  public removeLiquiditiesBy = async (): Promise<RemoveLiquidityResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  public getLiquidityRewardByAddressAndPoolId = async (
    address: string,
    poolId: string,
  ): Promise<LiquidityRewardResponse> => {
    const poolDetail = await this.poolRepository.getPoolById(poolId);
    return {
      pool_id: poolId,
      ...LiquidityRepositoryMock.generatePoolReward(poolDetail.liquidity),
    };
  };

  public claimRewardByPoolId = async (): Promise<ClaimRewardResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  private getLiquidityDetailInfos = async () => {
    const infos = [...LiquidityDatas.liquidities];
    const liquidities = [];
    for (const info of infos) {
      const poolDetail = await this.poolRepository.getPoolById(info.pool_id);
      const poolDetailInfos = LiquidityRepositoryMock.generateLiquidityAndReward(
        poolDetail,
      );
      liquidities.push({
        ...info,
        ...poolDetailInfos,
      });
    }
    return liquidities;
  };

  private static generateLiquidityAndReward = (poolInfo: PoolInfoResponse) => {
    const tokenPair = poolInfo.liquidity;
    return {
      liquidity: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      apr: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      reward: {
        staking: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
        swap: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      },
    };
  };

  private static generatePoolReward = (tokenPair: {
    token0: TokenResponse;
    token1: TokenResponse;
  }) => {
    return {
      is_claim: true,
      total_balance: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      daily_earning: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      reward: {
        staking: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
        swap: LiquidityRepositoryMock.generateTokenPairByInfo(tokenPair),
      },
    };
  };

  private static generateTokenPairByInfo = (tokenPair: {
    token0: TokenResponse;
    token1: TokenResponse;
  }) => {
    const { token0, token1 } = tokenPair;
    return {
      token0: LiquidityRepositoryMock.randomToken(token0),
      token1: LiquidityRepositoryMock.randomToken(token1),
    };
  };

  private static randomToken = (token: TokenResponse) => {
    return {
      ...token,
      amount: {
        ...token.amount,
        value: generateNumberPlus(),
      },
    };
  };
}
