import { TokenModel } from "@models/token/token-model";

export interface OrderGasRequest {
  gasFee?: number;
  gasUsed?: number;
}

export interface CreateDcaOrderRequest extends OrderGasRequest {
  inputToken: TokenModel;
  outputToken: TokenModel;
  /** Interval between executions, in seconds. */
  interval: number;
  slotOffset: number;
  /** Raw integer amount sold per execution. */
  amountPerExecution: string;
  executionCount: number;
}

export interface CreateLimitOrderRequest extends OrderGasRequest {
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  /** Input token for Sell, output token for Buy. */
  baseToken: TokenModel;
  /** Raw integer amount of `tokenIn` to sell. */
  makingAmount: string;
  /** Raw integer amount of `tokenOut` the owner must receive. */
  takingAmount: string;
  slippageBps: number;
  /** Unix seconds. */
  expiresAt: number;
}

export interface CancelOrderRequest extends OrderGasRequest {
  orderId: string;
  /**
   * Realm of the order. An order of an earlier realm deployment is cancelled
   * or claimed in that realm; defaults to the current one.
   */
  packagePath?: string;
}
