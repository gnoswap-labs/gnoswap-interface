import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

/**
 * Enum-like type for all supported message types in the Gno blockchain.
 * These correspond to the protobuf message type URLs used in transaction encoding.
 *
 * @see {@link https://github.com/gnolang/gno/tree/master/tm2/pkg/sdk/bank} - Bank module messages
 * @see {@link https://github.com/gnolang/gno/tree/master/gnovm/pkg/gnolang} - VM module messages
 */
export type EMessageType = "/bank.MsgSend" | "/vm.m_call" | "/vm.m_addpkg" | "/vm.m_run";

/**
 * Union type of all possible message value types from the gno-js-client.
 * Each message type has a specific structure defined by the Gno blockchain protocol.
 *
 * - MsgSend: Native GNOT token transfers between addresses
 * - MsgCall: Smart contract function calls (including GRC20 transfers)
 * - MsgAddPackage: Package/realm deployment to the blockchain
 * - MsgRun: Execute arbitrary Gno code (used for testing/development)
 */
export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

/**
 * Represents a typed message that can be included in a transaction.
 * This interface provides type safety by linking message types with their corresponding value structures.
 *
 * @example
 * ```typescript
 * const transferMessage: ContractMessage = {
 *   type: "/bank.MsgSend",
 *   value: {
 *     from_address: "g1sender",
 *     to_address: "g1receiver",
 *     amount: "1000ugnot"
 *   } as MsgSend
 * };
 * ```
 */
export interface ContractMessage {
  type: EMessageType;
  value: TMessage;
}

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
  /**
   * Simplified contract information for UI display.
   * Each entry corresponds to a message but with flattened structure for easier access.
   */
  contracts: {
    /** The message type (e.g., "/vm.m_call", "/bank.MsgSend") */
    type: string;
    /** Human-readable function name (e.g., "Transfer", "Swap", "AddLiquidity") */
    function: string;
    /**
     * Flattened value object containing all possible fields from different message types.
     * This approach was chosen over a union type to simplify UI rendering logic.
     * Only relevant fields will be populated based on the message type.
     */
    value: {
      /** Address initiating the contract call (MsgCall, MsgRun) */
      caller?: string;
      /** Amount to send with the transaction (MsgCall, MsgRun) */
      send?: string;
      /** Package path for contract calls (MsgCall) */
      pkg_path?: string;
      /** Function name being called (MsgCall) */
      func?: string;
      /** Function arguments (MsgCall) */
      args?: string[] | null;
      /** Sender address for transfers (MsgSend) */
      from_address?: string;
      /** Recipient address for transfers (MsgSend) */
      to_address?: string;
      /** Transfer amount (MsgSend) */
      amount?: string;
      /** Package creator (MsgAddPackage) */
      creator?: string;
      /** Package data (MsgAddPackage, MsgRun) */
      package?: unknown;
      /** Deposit amount for package deployment (MsgAddPackage) */
      deposit?: string;
    };
  }[];
  /** Requested gas limit as string */
  gasWanted: string;
  /** Gas fee in format "amount+denom" (e.g., "1000000ugnot") */
  gasFee: string;
  /** Transaction memo */
  memo: string;
  /** The original document structure for wallet signing */
  document: Document;
}
