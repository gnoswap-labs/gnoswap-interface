import { Document, TransactionData, ContractMessage } from "src/types/transaction-messages.types";
import { MsgCall, MsgSend, MsgAddPackage } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

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
  messages: ContractMessage[];
  gasWanted: number;
  gasFee?: number;
  memo?: string | undefined;
}): Document => {
  return {
    msgs: [...args.messages],
    fee: {
      amount: [
        {
          // amount: String(162_686),
          amount: String(args.gasFee),
          denom: "ugnot",
        },
      ],
      // gas: String(162_685_490),
      gas: Number(args.gasWanted ?? 0 * 1.1).toString(),
    },
    chain_id: args.chainId,
    memo: args.memo || "",
    account_number: args.accountNumber.toString(),
    sequence: args.accountSequence.toString(),
  };
};

export function mappedDocumentMessagesWithCaller(
  messages: ContractMessage[],
  currentAddress: string,
): ContractMessage[] {
  if (!messages) {
    return [];
  }

  return messages
    .map(message => {
      const type = message.type;
      switch (type) {
        case "/bank.MsgSend": {
          const msgSendValue = message.value as MsgSend;
          return {
            ...message,
            value: {
              ...msgSendValue,
              from_address: msgSendValue.from_address || currentAddress,
            } as MsgSend,
          };
        }
        case "/vm.m_call": {
          const msgCallValue = message.value as MsgCall;
          return {
            ...message,
            value: {
              ...msgCallValue,
              caller: msgCallValue.caller || currentAddress,
            } as MsgCall,
          };
        }
        case "/vm.m_addpkg": {
          const msgAddPackageValue = message.value as MsgAddPackage;
          return {
            ...message,
            value: {
              ...msgAddPackageValue,
              creator: msgAddPackageValue.creator || currentAddress,
            } as MsgAddPackage,
          };
        }
        case "/vm.m_run": {
          const msgRunValue = message.value as MsgRun;
          return {
            ...message,
            value: {
              ...msgRunValue,
              caller: msgRunValue.caller || currentAddress,
            } as MsgRun,
          };
        }
        default:
          return null;
      }
    })
    .filter(message => message !== null) as ContractMessage[];
}
