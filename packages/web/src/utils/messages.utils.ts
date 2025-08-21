import { Document, TransactionData, ContractMessage } from "src/types/transaction-messages.types";
import { MsgCall, MsgSend, MsgAddPackage } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

export function mappedTransactionData(document: Document): TransactionData {
  return {
    messages: document.msgs,
    contracts: document.msgs.map(message => {
      // Create a base contract object with type-specific function name
      const baseContract = {
        type: message?.type || "",
        function: message.type === "/bank.MsgSend" ? "Transfer" : "",
      };

      // Handle different message types with proper type narrowing
      switch (message.type) {
        case "/bank.MsgSend": {
          const msgSend = message.value as MsgSend;
          return {
            ...baseContract,
            function: "Transfer",
            value: {
              from_address: msgSend.from_address,
              to_address: msgSend.to_address,
              amount: msgSend.amount,
            },
          };
        }
        case "/vm.m_call": {
          const msgCall = message.value as MsgCall;
          return {
            ...baseContract,
            function: msgCall.func,
            value: {
              caller: msgCall.caller,
              send: msgCall.send,
              pkg_path: msgCall.pkg_path,
              func: msgCall.func,
              args: msgCall.args,
            },
          };
        }
        case "/vm.m_addpkg": {
          const msgAddPkg = message.value as MsgAddPackage;
          return {
            ...baseContract,
            function: "AddPackage",
            value: {
              creator: msgAddPkg.creator,
              package: msgAddPkg.package,
              deposit: msgAddPkg.deposit,
            },
          };
        }
        case "/vm.m_run": {
          const msgRun = message.value as MsgRun;
          return {
            ...baseContract,
            function: "Run",
            value: {
              caller: msgRun.caller,
              send: msgRun.send,
              package: msgRun.package,
            },
          };
        }
        default:
          // Fallback for unknown message types
          return {
            ...baseContract,
            value: {},
          };
      }
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
          amount: String(args.gasFee),
          denom: "ugnot",
        },
      ],
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
