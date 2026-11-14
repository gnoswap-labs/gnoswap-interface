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
}

export interface MaxNativeAmount {
  /** Largest amount the action can spend, in ugnot. */
  amount: string;
  reserve: NativeAmountReserve;
  /** Whether a simulation was used to price the reserve. */
  simulated: boolean;
}

/** What a transaction costs its signer, measured by simulation. Every amount is an integer ugnot string. */
export interface TransactionFeeEstimate {
  /** Gas the simulation burned. */
  gasUsed: number;
  /** Gas used priced at the current gas price. */
  gasFee: string;
  /** Storage deposit the transaction locks. */
  storageDeposit: string;
  /** Sum of the gas fee and the storage deposit. */
  total: string;
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
   *
   * Positive amounts require a successful simulation. Rejects when the action
   * cannot be measured; an insufficient balance may still resolve to zero.
   */
  estimateMaxNativeAmount(request: MaxNativeAmountRequest): Promise<MaxNativeAmount>;

  /**
   * Simulates the messages as the connected signer and prices the gas burned
   * plus the storage deposit locked. Null when the transaction cannot be simulated.
   */
  estimateTransactionFee(messages: TransactionMessage[]): Promise<TransactionFeeEstimate | null>;
}
