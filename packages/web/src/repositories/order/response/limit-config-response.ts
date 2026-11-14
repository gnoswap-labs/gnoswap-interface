import { OrderHaltedStatus } from "./order-api-response";

export interface LimitConfigResponse {
  /** Raw integer string. */
  minMakingAmount: string;
  minDurationSec: number;
  maxDurationSec: number;
  executionFeeBps: number;
  routerFeeBps: number;
  maxSlippageBps: number;
  halted: OrderHaltedStatus;
  /**
   * Pool paths (`token0:token1:fee`) accepted by the Limit realm. Older order-api
   * versions omit this field, so orders must remain blocked until it is available.
   */
  whitelistedPools?: string[];
}
