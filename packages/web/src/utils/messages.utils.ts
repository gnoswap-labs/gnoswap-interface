import { TransactionData } from "src/types/transaction-messages.types";
import { Document } from "src/types/transaction-messages.types";

export function mappedTransactionData(document: Document): TransactionData {
  return {
    messages: document.msgs,
    contracts: document.msgs.map(message => {
      return {
        type: message?.type || "",
        function: message.type === "/bank.MsgSend" ? "Transfer" : message.value.func,
        value: {
          caller: message.value.caller,
          send: message.value.send,
          pkg_path: message.value.pkg_path,
          func: message.value.func,
          args: message.value.args,
        },
      };
    }),
    gasWanted: document.fee.gas,
    gasFee: `${document.fee.amount[0].amount}${document.fee.amount[0].denom}`,
    memo: `${document.memo || ""}`,
    document,
  };
}

export const createDocument = (args: {
  accountSequence: number;
  accountNumber: number;
  chainId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  gasWanted: number;
  gasFee?: number;
  memo?: string | undefined;
}): Document => {
  return {
    msgs: [...args.messages],
    fee: {
      amount: [
        {
          amount: String(args.gasFee),
          denom: "ugnot",
        },
      ],
      gas: args.gasWanted.toString(),
    },
    chain_id: args.chainId,
    memo: args.memo || "",
    account_number: args.accountNumber.toString(),
    sequence: args.accountSequence.toString(),
  };
};
