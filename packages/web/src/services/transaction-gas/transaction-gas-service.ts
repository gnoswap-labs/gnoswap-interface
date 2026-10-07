import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { Tx } from "@gnolang/tm2-js-client";

/** Every amount is an integer ugnot string. */
export interface NativeAmountReserve {
  /** The fee the transaction offers. Deducted in full whether or not the gas is burned. */
  gasFee: string;
  /** Storage deposit locked by the transaction. Refunded when the state is released. */
  storageDeposit: string;
  /** Safety margin on top of the two costs above. */
  buffer: string;
  /** Sum of the fields above, the amount that must stay in the wallet. */
  total: string;
}

export interface MaxNativeAmountRequest {
  /** Native balance available to the action, in ugnot. */
  balance: string;
  /** Builds the messages the action would broadcast for a candidate amount in ugnot. */
  makeMessages: (amount: string) => TransactionMessage[] | Promise<TransactionMessage[]>;
  /**
   * Fee the transaction will offer, in ugnot. Reserved as it stands rather than
   * measured, because the chain deducts the offered fee in full and every send
   * path offers a flat amount.
   */
  gasFee?: string;
  /** Execution ceiling the transaction will carry. */
  gasWanted?: number;
  /** Reserve to fall back on when the action cannot be simulated, in ugnot. */
  fallbackReserve?: string;
}

export interface MaxNativeAmount {
  /** Largest amount the action can spend, in ugnot. */
  amount: string;
  reserve: NativeAmountReserve;
  /** False when the reserve came from {@link MaxNativeAmountRequest.fallbackReserve}. */
  simulated: boolean;
}

export interface TransactionGasService {
  getGasPrices: () => Promise<number | null>;

  estimateGas(tx: Tx): Promise<number>;

  /**
   * Largest native amount an action can spend while still covering its own gas
   * fee and storage deposit.
   *
   * The gas fee is known up front — it is the flat amount the send path offers.
   * The storage deposit is not: it is charged per byte of new realm state, and
   * an action doing more work for a larger amount writes more of it. So the
   * action is simulated to measure the deposit, at an amount that leaves room
   * for both costs, and the result is verified once it is known.
   */
  estimateMaxNativeAmount(request: MaxNativeAmountRequest): Promise<MaxNativeAmount>;
}
