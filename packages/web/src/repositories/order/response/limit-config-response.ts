import { OrderHaltedStatus } from "./order-api-response";

export interface LimitConfigResponse {
  /** Raw integer string. */
  minMakingAmount: string;
  minDurationSec: number;
  maxDurationSec: number;
  executionFeeBps: number;
  routerFeeBps: number;
  maxSlippageBps: number;
  /** USD amount as a decimal string. */
  minOrderUsd: string;
  halted: OrderHaltedStatus;
}
