import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

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
          amount: String(162_686),
          // amount: String(args.gasFee),
          denom: "ugnot",
        },
      ],
      gas: String(162_685_490),
      // gas: Number(args.gasWanted ?? 0 * 1.1).toString(),
    },
    chain_id: args.chainId,
    memo: args.memo || "",
    account_number: args.accountNumber.toString(),
    sequence: args.accountSequence.toString(),
  };
};

export type EMessageType = "/bank.MsgSend" | "/vm.m_call" | "/vm.m_addpkg" | "/vm.m_run";

export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export type ContractMessage = {
  type: EMessageType;
  value: TMessage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mappedDocumentMessagesWithCaller(messages: any[], currentAddress: string): ContractMessage[] {
  if (!messages) {
    return [];
  }

  return (
    messages
      .map(message => {
        const type = message.type;
        switch (type) {
          case "/bank.MsgSend":
            return {
              ...message,
              value: {
                ...message.value,
                from_address: message.value.from_address || currentAddress,
              },
            };
          case "/vm.m_call":
            return {
              ...message,
              value: {
                ...message.value,
                caller: message.value.caller || currentAddress,
              },
            };
          case "/vm.m_addpkg":
            return {
              ...message,
              value: {
                ...message.value,
                creator: message.value.creator || currentAddress,
              },
            };
          case "/vm.m_run":
            return {
              ...message,
              value: {
                ...message.value,
                caller: message.value.caller || currentAddress,
              },
            };
        }
        return null;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter(message => message !== null) as any[]
  );
}
