import { Document, TransactionData, ContractMessage, EMessageType } from "src/types/transaction-messages.types";
import { MsgCall, MsgSend, MsgAddPackage } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

/*
## Context

In the Gno blockchain, transaction messages (`ContractMessage`) serve
multiple roles in the application:

1. Blockchain-facing representation
   - Used when constructing or broadcasting transactions
   - Must strictly follow the protobuf-defined message schemas

2. UI-facing representation
   - Simplified view (`TransactionData.contracts`) for display, analytics,
     and user interaction
   - Flattens and normalizes different message types into a unified shape

Because these two use cases differ in both structure and semantics,
we maintain two separate handler maps:

- transactionDataHandlers
  - Converts `ContractMessage` into UI-facing contract entries
  - Extracts and flattens fields for simplified rendering

- callerFillHandlers
  - Ensures that blockchain messages always include the correct
    `caller`, `creator`, or `from_address` field
  - Used to "patch" incomplete messages before submission

## Why not a single handler?

Combining the two concerns into one handler would force us to mix
UI-specific transformations with blockchain-level validation logic.
This would complicate the type model:

- `TransactionData.contracts` requires a flattened union type
- `ContractMessage` requires strict protobuf-compatible values

By splitting the handlers, each function can operate with the correct
type guarantees, keeping the boundary between protocol-level and
application-level representations clear.
*/

/**
 * Handlers for mapping blockchain messages {@link ContractMessage} into
 * UI-facing contract entries {@link TransactionData.contracts}.
 * 
 * @internal
 */
const transactionDataHandlers: Record<
  EMessageType,
  (message: ContractMessage) => TransactionData["contracts"][number]
> = {
  "/bank.MsgSend": message => {
    const msg = message.value as MsgSend;
    return {
      type: message.type,
      function: "Transfer",
      value: {
        from_address: msg.from_address,
        to_address: msg.to_address,
        amount: msg.amount,
      },
    };
  },
  "/vm.m_call": message => {
    const msg = message.value as MsgCall;
    return {
      type: message.type,
      function: msg.func,
      value: {
        caller: msg.caller,
        send: msg.send,
        pkg_path: msg.pkg_path,
        func: msg.func,
        args: msg.args,
      },
    };
  },
  "/vm.m_addpkg": message => {
    const msg = message.value as MsgAddPackage;
    return {
      type: message.type,
      function: "AddPackage",
      value: {
        creator: msg.creator,
        package: msg.package,
        deposit: msg.deposit,
      },
    };
  },
  "/vm.m_run": message => {
    const msg = message.value as MsgRun;
    return {
      type: message.type,
      function: "Run",
      value: {
        caller: msg.caller,
        send: msg.send,
        package: msg.package,
      },
    };
  },
};

/**
 * Handlers for filling in missing caller/sender addresses in {@link ContractMessage}s.
 *
 * These are typically used when constructing a transaction to ensure that
 * messages always include a valid `caller`, `from_address`, or `creator`
 * (depending on the message type).
 * 
 * @internal
 */
const callerFillHandlers: Record<EMessageType, (message: ContractMessage, currentAddress: string) => ContractMessage> =
  {
    "/bank.MsgSend": (message, currentAddress) => {
      const value = message.value as MsgSend;
      return {
        ...message,
        value: { ...value, from_address: value.from_address || currentAddress },
      };
    },
    "/vm.m_call": (message, currentAddress) => {
      const value = message.value as MsgCall;
      return {
        ...message,
        value: { ...value, caller: value.caller || currentAddress },
      };
    },
    "/vm.m_addpkg": (message, currentAddress) => {
      const value = message.value as MsgAddPackage;
      return {
        ...message,
        value: { ...value, creator: value.creator || currentAddress },
      };
    },
    "/vm.m_run": (message, currentAddress) => {
      const value = message.value as MsgRun;
      return {
        ...message,
        value: { ...value, caller: value.caller || currentAddress },
      };
    },
  };

/**
 * Maps a raw transaction {@link Document} into the internal {@link TransactionData} format used by the application.
 *
 * @param document - Raw transaction document including chain info, fee, and messages
 * @returns A structured `TransactionData` object suitable for UI rendering and analytics
 *
 * @example
 * ```ts
 * const doc: Document = { ... };
 * const txData = mappedTransactionData(doc);
 * console.log(txData.contracts[0].function); // e.g. "Transfer"
 * ```
 *
 * @remarks
 * - Uses {@link transactionDataHandlers} to transform messages into simplified contracts.
 * - Gas fee is formatted as `amount+denom` (e.g. `"1000ugnot"`).
 * - Ensures memo field is always a string.
 */
export function mappedTransactionData(document: Document): TransactionData {
  return {
    messages: document.msgs,
    contracts: document.msgs.map(message => {
      const handler = transactionDataHandlers[message.type as EMessageType];
      return handler ? handler(message) : { type: message.type, function: "", value: {} };
    }),
    gasWanted: document.fee.gas,
    gasFee: `${document.fee.amount[0].amount}${document.fee.amount[0].denom}`,
    memo: document.memo || "",
    document,
  };
}

/**
 * Creates a {@link Document} from application-level arguments.
 *
 * @param args - Transaction parameters including account info, gas, messages, etc.
 * @returns A fully constructed {@link Document} ready for signing/broadcasting
 *
 * @example
 * ```ts
 * const doc = createDocument({
 *   accountSequence: 1,
 *   accountNumber: 42,
 *   chainId: "test3",
 *   messages: [contractMsg],
 *   gasWanted: 200000,
 *   gasFee: 1000,
 *   memo: "Hello Gno"
 * });
 * ```
 *
 * @remarks
 * - Automatically stringifies numeric fields (`sequence`, `account_number`, etc.).
 * - Gas is multiplied by 1.1 (rounded up) to provide a buffer.
 */
export const createDocument = (args: {
  accountSequence: number;
  accountNumber: number;
  chainId: string;
  messages: ContractMessage[];
  gasWanted: number;
  gasFee?: number;
  memo?: string;
}): Document => ({
  msgs: [...args.messages],
  fee: {
    amount: [
      {
        amount: String(args.gasFee),
        denom: "ugnot",
      },
    ],
    // TODO: The existing code may have the following issues:
    // - Due to operator precedence, `args.gasWanted ?? 0` is calculated first, then `* 1.1` is applied
    // - Floating-point operation results are directly converted to string
    // This caused issues where completely different values than expected were produced. Since gas values are typically represented as integers, using ceiling seemed advantageous.
    // If any related issues occur, revert this line.
    gas: Math.ceil(args.gasWanted * 1.1).toString(),
  },
  chain_id: args.chainId,
  memo: args.memo || "",
  account_number: args.accountNumber.toString(),
  sequence: args.accountSequence.toString(),
});

/**
 * Ensures that messages in a transaction contain the proper caller/sender address.
 *
 * @param messages - Array of blockchain messages
 * @param currentAddress - Default address to fill when missing
 * @returns A new array of {@link ContractMessage}s with updated sender/caller fields
 *
 * @example
 * ```ts
 * const msgs = mappedDocumentMessagesWithCaller(doc.msgs, "g1myaddress");
 * console.log(msgs[0].value.from_address); // => "g1myaddress"
 * ```
 *
 * @remarks
 * - Delegates to {@link callerFillHandlers} for each message type.
 * - Filters out `null` values to guarantee the result is an array of {@link ContractMessage}.
 */
export function mappedDocumentMessagesWithCaller(
  messages: ContractMessage[],
  currentAddress: string,
): ContractMessage[] {
  return (messages || [])
    .map(message => {
      const handler = callerFillHandlers[message.type as EMessageType];
      return handler ? handler(message, currentAddress) : null;
    })
    .filter((m): m is ContractMessage => m !== null);
}
