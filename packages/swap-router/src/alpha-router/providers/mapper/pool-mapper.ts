import BigNumber from "bignumber.js";
import { tickToSqrtPriceX96 } from "../../../swap-simulator";
import { parseFeeAmount } from "../../utility";
import { Pool } from "../../v3-sdk";
import { PoolResponse } from "../response/pool-response";
import { mapTokenByResponse } from "./token-mapper";

const LIQUIDITY_DECIMALS = 6;

export function mapPoolByResponse(poolResponse: PoolResponse): Pool {
  const { tokenA, tokenB, tvl, fee, currentTick } = poolResponse;

  const liquidity = BigNumber(tvl).shiftedBy(LIQUIDITY_DECIMALS).toFixed(0);
  const currentTickNum = Number(currentTick);

  return new Pool(
    mapTokenByResponse(tokenA),
    mapTokenByResponse(tokenB),
    parseFeeAmount(fee),
    tickToSqrtPriceX96(currentTickNum).toString(),
    liquidity,
    currentTickNum,
  );
}
