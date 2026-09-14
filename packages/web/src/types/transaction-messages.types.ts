import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

/**
 * Enum-like type for all supported message types in the Gno blockchain.
 * These correspond to the protobuf message type URLs used in transaction encoding.
 *
 * @see {@link https://github.com/gnolang/gno/tree/master/tm2/pkg/sdk/bank} - Bank module messages
 * @see {@link https://github.com/gnolang/gno/tree/master/gnovm/pkg/gnolang} - VM module messages
 */
export type EMessageType = ContractMessage["type"];

/**
 * Union type of all possible message value types from the gno-js-client.
 * Each message type has a specific structure defined by the Gno blockchain protocol.
 *
 * - MsgSend: Native GNOT token transfers between addresses
 * - MsgCall: Smart contract function calls (including GRC20 transfers)
 * - MsgAddPackage: Package/realm deployment to the blockchain
 * - MsgRun: Execute arbitrary Gno code (used for testing/development)
 */
export type TMessage = ContractMessage["value"];

/**
 * Represents a typed message that can be included in a transaction.
 * The discriminant links each message type with its required value fields.
 *
 * @example
 * ```typescript
 * const transferMessage: ContractMessage = {
 *   type: "/bank.MsgSend",
 *   value: {
 *     from_address: "g1sender",
 *     to_address: "g1receiver",
 *     amount: "1000ugnot"
 *   }
 * };
 * ```
 */
export type ContractMessage =
  | { type: "/bank.MsgSend"; value: MsgSend }
  | { type: "/vm.m_call"; value: MsgCall }
  | { type: "/vm.m_addpkg"; value: MsgAddPackage }
  | { type: "/vm.m_run"; value: MsgRun };

export type TransactionContract = { function: string } & (
  | { type: "/bank.MsgSend"; value: MsgSend }
  | { type: "/vm.m_call"; value: Pick<MsgCall, "caller" | "send" | "pkg_path" | "func" | "args"> }
  | { type: "/vm.m_addpkg"; value: Pick<MsgAddPackage, "creator" | "package"> }
  | { type: "/vm.m_run"; value: Pick<MsgRun, "caller" | "send" | "package"> }
  | { type: "unknown"; rawType: string; value: Record<string, never> }
);

/**
 * Represents a transaction document that follows the Cosmos SDK transaction format.
 * This is the structure required for signing and broadcasting transactions on the Gno blockchain.
 *
 * The Document structure is designed to be wallet-agnostic and can be used with:
 * - Adena wallet (native Gno wallet)
 * - Social wallets (Google, email-based authentication)
 * - Future wallet implementations
 *
 * @see {@link https://docs.cosmos.network/v0.46/core/transactions.html} - Cosmos SDK transaction format
 */
export interface Document {
  /** The chain identifier (e.g., "test3" for testnet, "portal-loop" for mainnet) */
  chain_id: string;
  /** The account number from the blockchain state */
  account_number: string;
  /** The sequence number (nonce) for replay protection */
  sequence: string;
  /** Fee configuration for the transaction */
  fee: {
    /** Array of fee amounts (typically single entry with ugnot) */
    amount: {
      /** Token denomination (usually "ugnot") */
      denom: string;
      /** Amount in smallest unit (1 GNOT = 1,000,000 ugnot) */
      amount: string;
    }[];
    /** Maximum gas units that can be consumed */
    gas: string;
    /** Optional account that pays fees on behalf of the transaction signer */
    granter?: string;
    /** Optional explicit fee payer (when different from signer) */
    payer?: string;
  };
  /** Array of typed messages to execute in the transaction */
  msgs: ContractMessage[];
  /** Optional memo field for additional transaction metadata */
  memo: string;
}

/**
 * Internal representation of transaction data used within the application.
 * This interface bridges the gap between user actions and blockchain transactions.
 *
 * The dual structure (messages + contracts) serves different purposes:
 * - `messages`: The actual blockchain messages in their final form
 * - `contracts`: Simplified view for UI display and transaction tracking
 *
 * This separation allows for:
 * 1. Easy display of transaction details in the UI
 * 2. Proper message formatting for blockchain submission
 * 3. Transaction history and analytics tracking
 */
export interface TransactionData {
  /** Read-only array of blockchain messages to be sent */
  messages: readonly ContractMessage[];
  /** Message-specific fields used to display transaction details. */
  contracts: TransactionContract[];
  /** Requested gas limit as string */
  gasWanted: string;
  /** Gas fee in format "amount+denom" (e.g., "1000000ugnot") */
  gasFee: string;
  /** Transaction memo */
  memo: string;
  /** The original document structure for wallet signing */
  document: Document;
}
