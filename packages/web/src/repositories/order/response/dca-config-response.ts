import { OrderHaltedStatus } from "./order-api-response";

export interface DcaAllowedInterval {
  /** Interval between executions, in seconds. */
  interval: number;
  /** Step between slot offsets the interval accepts, in seconds. */
  slotStep: number;
}

export interface DcaConfigResponse {
  allowedIntervals: DcaAllowedInterval[];
  /** Raw integer string. */
  minAmountPerExecution: string;
  maxExecutionCount: number;
  executionFeeBps: number;
  routerFeeBps: number;
  minExecutionGapRate: number;
  halted: OrderHaltedStatus;
  /**
   * Pool paths (`token0:token1:fee`) DCA orders may trade on, indexed from the
   * realm's whitelist events. A new order needs one of its pair's pools here.
   * Absent from order-api versions before the whitelist.
   */
  whitelistedPools?: string[];
}
