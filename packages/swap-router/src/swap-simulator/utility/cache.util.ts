import { Pool } from "../swap-simulator.types";

export function makeCacheKey(
  pool: Pool,
  exactType: "EXACT_IN" | "EXACT_OUT",
  zeroForOne: boolean,
) {
  const { poolPath } = pool;
  return `${poolPath}${exactType}${zeroForOne}`;
}
