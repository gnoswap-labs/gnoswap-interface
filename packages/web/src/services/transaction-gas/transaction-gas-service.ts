import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { Tx } from "@gnolang/tm2-js-client";

/** Every amount is an integer ugnot string. */
export interface NativeAmountReserve {
  /** Offered gas fee, deducted in full whether or not the gas is burned. */
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
   * Largest native amount an action can spend while still covering its own
   * gas fee and storage deposit.
   *
   * Both costs grow with the amount for actions whose work depends on it — a
   * swap crossing more pools, a mint initializing more ticks — so the reserve
   * cannot be read off a single simulation of an arbitrary amount. Instead the
   * action is simulated twice: once to measure the costs, once to prove the
   * resulting amount is affordable.
   */
  estimateMaxNativeAmount(request: MaxNativeAmountRequest): Promise<MaxNativeAmount>;
}
