export interface DcaPairPriceLimit {
  /** Minimum output per input the realm accepts for a round, as a Q128 fixed-point integer string. */
  minOutputPerInputX128: string;
  /** Unix seconds. */
  updatedAt: number;
}

/** DCA settings of one `inputToken → outputToken` direction. */
export interface DcaPairResponse {
  inputToken: string;
  outputToken: string;
  /**
   * Effective minimum sold per execution for the input token: the larger of
   * the global and the input token's own minimum. Raw integer string.
   */
  minAmountPerExecution: string;
  /** Null when the manager has not set a price limit for this direction. */
  priceLimit: DcaPairPriceLimit | null;
  /** Whether the direction has a price limit and at least one whitelisted pool. */
  supported: boolean;
}
