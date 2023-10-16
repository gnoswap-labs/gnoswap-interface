import { TokenPairAmountInfo } from "@models/token/token-pair-amount-info";
import { PositionModel } from "../position-model";

export class PositionMapper {
  public static toTokenPairAmount(
    position: PositionModel,
  ): TokenPairAmountInfo {
    const tokenA = position.pool.tokenA;
    const tokenB = position.pool.tokenB;

    return {
      tokenA,
      tokenB,
      tokenAAmount: {
        amount: position.reserveA,
        currency: tokenA.symbol,
      },
      tokenBAmount: {
        amount: position.reserveB,
        currency: tokenB.symbol,
      },
    };
  }
}
