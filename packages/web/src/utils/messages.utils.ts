import { Document, TransactionData, ContractMessage } from "src/types/transaction-messages.types";

/** Maps protocol messages to the fields displayed in the approval modal. */
function mapTransactionContract(message: ContractMessage): TransactionData["contracts"][number] {
  switch (message.type) {
    case "/bank.MsgSend":
      return { ...message, function: "Transfer" };
    case "/vm.m_call": {
      const { caller, send, pkg_path, func, args } = message.value;
      return { type: message.type, function: func, value: { caller, send, pkg_path, func, args } };
    }
    case "/vm.m_addpkg": {
      const { creator, package: packageData } = message.value;
      return { type: message.type, function: "AddPackage", value: { creator, package: packageData } };
    }
    case "/vm.m_run": {
      const { caller, send, package: packageData } = message.value;
      return { type: message.type, function: "Run", value: { caller, send, package: packageData } };
    }
    default:
      throw new Error("Unsupported transaction message type");
  }
}

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
 * - Preserves the message type and its required display fields.
 * - Gas fee is formatted as `amount+denom` (e.g. `"1000ugnot"`).
 * - Ensures memo field is always a string.
 */
export function mappedTransactionData(document: Document): TransactionData {
  return {
    messages: document.msgs,
    contracts: document.msgs.map(mapTransactionContract),
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
 * - Gas is multiplied by 1.3 (rounded up) to provide a buffer.
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
    gas: Math.ceil(args.gasWanted * 1.3).toString(),
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
 * - Fills the address field associated with each message type.
 * - Filters out `null` values to guarantee the result is an array of {@link ContractMessage}.
 */
export function mappedDocumentMessagesWithCaller(
  messages: ContractMessage[],
  currentAddress: string,
): ContractMessage[] {
  return (messages || [])
    .map((message): ContractMessage | null => {
      switch (message.type) {
        case "/bank.MsgSend":
          return {
            ...message,
            value: { ...message.value, from_address: message.value.from_address || currentAddress },
          };
        case "/vm.m_call":
          return { ...message, value: { ...message.value, caller: message.value.caller || currentAddress } };
        case "/vm.m_run":
          return { ...message, value: { ...message.value, caller: message.value.caller || currentAddress } };
        case "/vm.m_addpkg":
          return { ...message, value: { ...message.value, creator: message.value.creator || currentAddress } };
        default:
          return null;
      }
    })
    .filter((m): m is ContractMessage => m !== null);
}
