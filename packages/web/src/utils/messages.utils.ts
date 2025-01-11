import { Any, PubKeySecp256k1, Tx, TxFee, TxSignature } from "@gnolang/tm2-js-client";
import { MsgCall, MsgAddPackage, MsgSend, MsgEndpoint } from "@gnolang/gno-js-client";
import { MemPackage, MemFile, MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";
import { base64ToUint8Array } from "@gnolang/tm2-js-client";

export interface Document {
  chain_id: string;
  account_number: string;
  sequence: string;
  fee: {
    amount: {
      denom: string;
      amount: string;
    }[];
    gas: string;
    granter?: string;
    payer?: string;
  };
  msgs: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
  }[];
  memo: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeTxMessages = (messages: Any[]): any[] => {
  return messages.map((m: Any) => {
    switch (m.typeUrl) {
      case MsgEndpoint.MSG_CALL: {
        const decodedMessage = MsgCall.decode(m.value);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messageJson = MsgCall.toJSON(decodedMessage) as any;
        return {
          "@type": m.typeUrl,
          ...messageJson,
          send: messageJson?.send || "",
        };
      }
      case MsgEndpoint.MSG_SEND: {
        const decodedMessage = MsgSend.decode(m.value);
        const messageJson = MsgSend.toJSON(decodedMessage) as object;
        return {
          "@type": m.typeUrl,
          ...messageJson,
        };
      }
      case MsgEndpoint.MSG_ADD_PKG: {
        const decodedMessage = MsgAddPackage.decode(m.value);
        const messageJson = MsgAddPackage.toJSON(decodedMessage) as object;
        return {
          "@type": m.typeUrl,
          ...messageJson,
        };
      }
      case MsgEndpoint.MSG_RUN: {
        const decodedMessage = MsgRun.decode(m.value);
        const messageJson = MsgRun.toJSON(decodedMessage) as object;
        return {
          "@type": m.typeUrl,
          ...messageJson,
        };
      }
      default:
        throw new Error(`unsupported message type ${m.typeUrl}`);
    }
  });
};

function createMemPackage(memPackage: RawMemPackage) {
  return MemPackage.create({
    name: memPackage.name,
    path: memPackage.path,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files: memPackage.files.map((file: any) =>
      MemFile.create({
        name: file.name,
        body: file.body,
      }),
    ),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeMessageValue(message: { type: string; value: any }) {
  switch (message.type) {
    case MsgEndpoint.MSG_ADD_PKG: {
      const value = message.value;
      const msgAddPackage = MsgAddPackage.create({
        creator: value.creator,
        deposit: value.deposit || null,
        package: value.package ? createMemPackage(value.package) : undefined,
      });
      return Any.create({
        typeUrl: MsgEndpoint.MSG_ADD_PKG,
        value: MsgAddPackage.encode(msgAddPackage).finish(),
      });
    }
    case MsgEndpoint.MSG_CALL: {
      const args: string[] = message.value.args ? (message.value.args.length === 0 ? null : message.value.args) : null;
      const result = MsgCall.create({
        args: args,
        caller: message.value.caller,
        func: message.value.func,
        pkg_path: message.value.pkg_path,
        send: message.value.send || "",
      });
      return Any.create({
        typeUrl: MsgEndpoint.MSG_CALL,
        value: MsgCall.encode(result).finish(),
      });
    }
    case MsgEndpoint.MSG_SEND: {
      return Any.create({
        typeUrl: MsgEndpoint.MSG_SEND,
        value: MsgSend.encode(MsgSend.create(message.value)).finish(),
      });
    }
    case MsgEndpoint.MSG_RUN: {
      const value = message.value;
      const msgRun = MsgRun.create({
        caller: value.caller,
        send: value.send || null,
        package: value.package ? createMemPackage(value.package) : undefined,
      });
      return Any.create({
        typeUrl: MsgEndpoint.MSG_RUN,
        value: MsgRun.encode(msgRun).finish(),
      });
    }
    default: {
      return Any.create({
        typeUrl: MsgEndpoint.MSG_CALL,
        value: MsgCall.encode(MsgCall.fromJSON(message.value)).finish(),
      });
    }
  }
}

//
export function documentToTx(document: Document): Tx {
  const messages: Any[] = document.msgs.map(encodeMessageValue);
  return {
    messages,
    fee: TxFee.create({
      gasWanted: document.fee.gas,
      gasFee: document.fee.amount.map(feeAmount => `${feeAmount.amount}${feeAmount.denom}`).join(","),
    }),
    signatures: [],
    memo: document.memo,
  };
}

export function txToDocument(tx: Tx) {
  return Tx.toJSON(tx);
}

export interface RawBankSendMessage {
  "@type": string;
  from_address: string;
  to_address: string;
  amount: string;
}

export interface RawVmCallMessage {
  "@type": string;
  caller: string;
  func: string;
  send: string;
  pkg_path: string;
  args: string[];
}

export interface RawVmAddPackageMessage {
  "@type": string;
  creator: string;
  deposit: string;
  package: RawMemPackage;
}

export interface RawVmRunMessage {
  "@type": string;
  caller: string;
  send: string;
  package: RawMemPackage;
}

export interface RawMemPackage {
  name: string;
  path: string;
  files: {
    name: string;
    body: string;
  }[];
}

export type RawTxMessageType = RawBankSendMessage | RawVmCallMessage | RawVmAddPackageMessage | RawVmRunMessage;

export function decodeBase64(base64String: string) {
  try {
    return Buffer.from(base64String, "base64").toString("utf-8");
  } catch (error) {
    console.error("Invalid Base64 string", error);
    return null;
  }
}

export interface RawTx {
  msg: RawTxMessageType[];
  fee: { gas_wanted: string; gas_fee: string };
  signatures: {
    pub_key: {
      "@type": string;
      value: string;
    };
    signature: string;
  }[];
  memo: string;
}

/**
 * Change transaction json string to a Signed Tx.
 *
 * @param str
 * @returns Tx | null
 */
export const strToSignedTx = (str: string): Tx | null => {
  let rawTx = null;
  try {
    rawTx = JSON.parse(str);
  } catch (e) {
    console.error(e);
  }

  if (rawTx === null) return null;

  try {
    const document = rawTx as RawTx;
    const messages: Any[] = document.msg
      .map(msg => ({
        type: msg["@type"],
        value: { ...msg },
      }))
      .map(encodeMessageValue);
    return {
      messages,
      fee: TxFee.create({
        gasWanted: document.fee.gas_wanted,
        gasFee: document.fee.gas_fee,
      }),
      signatures: document.signatures.map(signature => {
        const publicKeyBytes = base64ToUint8Array(signature?.pub_key?.value || "");
        const wrappedPublicKeyValue: PubKeySecp256k1 = {
          key: publicKeyBytes,
        };
        const publicKeyTypeUrl = signature?.pub_key["@type"] || "";
        const encodedPublicKeyBytes = PubKeySecp256k1.encode(wrappedPublicKeyValue).finish();
        const signatureBytes = base64ToUint8Array(signature?.signature || "");
        return TxSignature.create({
          pubKey: {
            typeUrl: publicKeyTypeUrl,
            value: encodedPublicKeyBytes,
          },
          signature: signatureBytes,
        });
      }),
      memo: document.memo,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

// 1.
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
