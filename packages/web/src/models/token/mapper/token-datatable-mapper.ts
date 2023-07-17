import {
  MostLiquidityPoolType,
  TokenDetailType,
  TokenTableModel,
} from "@models/datatable/token-table-model";
import {
  MostLiquidityPoolInfo,
  TokenDatatableResponse,
  TokenTableData,
} from "@repositories/token";
import { amountEmptyBigNumInit } from "@common/values/global-initial-value";
import { amountFormatToBignum } from "@common/utils/denom-util";
import BigNumber from "bignumber.js";

export class TokenDatatableMapper {
  public static fromResponse(
    response: TokenDatatableResponse,
  ): TokenTableModel {
    const { hits, total, tokens } = response;
    return {
      hits,
      total,
      tokens: tokens.map(TokenDatatableMapper.mappedTokenKeyValue),
    };
  }

  private static mappedTokenKeyValue(t: TokenTableData): TokenDetailType {
    return {
      tokenId: t.token_id,
      type: t.type,
      name: t.name,
      symbol: t.symbol,
      price: BigNumber(t.price),
      priceOf1h: BigNumber(t.price_of_1h),
      priceOf24h: BigNumber(t.price_of_24h),
      priceOf7d: BigNumber(t.price_of_7d),
      mCap: BigNumber(t.m_cap),
      tvl: BigNumber(t.tvl),
      volume: BigNumber(t.volume),
      mostLiquidityPool: TokenDatatableMapper.mappedMostLiquidityPool(
        t.most_liquidity_pool,
      ),
      graph: t.graph,
    };
  }

  private static mappedMostLiquidityPool(
    p: MostLiquidityPoolInfo,
  ): MostLiquidityPoolType {
    return {
      feeTier: p.fee_tier,
      apr: p.apr,
      tokenPair: {
        token0: {
          tokenId: p.token0.token_id,
          tokenLogo: "",
          name: p.token0.name,
          symbol: p.token0.symbol,
          amount: p.token0.amount
            ? amountFormatToBignum(p.token0.amount)
            : amountEmptyBigNumInit,
        },
        token1: {
          tokenId: p.token1.token_id,
          tokenLogo: "",
          name: p.token1.name,
          symbol: p.token1.symbol,
          amount: p.token1.amount
            ? amountFormatToBignum(p.token1.amount)
            : amountEmptyBigNumInit,
        },
      },
    };
  }
}
