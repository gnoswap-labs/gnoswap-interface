/**
 * @example { result: "successfully executed faucet transfer" }
 */
export interface FaucetNativeSuccessResponse {
  result: string;
}

/**
 * @example "Your wallet already has tokens."
 */
export type FaucetNativeErrorResponse = string;

export type FaucetNativeResponse = FaucetNativeSuccessResponse | FaucetNativeErrorResponse;
