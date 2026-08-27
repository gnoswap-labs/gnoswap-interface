import { GnoProvider } from "@gnolang/gno-js-client";
import { Tx, uint8ArrayToBase64 } from "@gnolang/tm2-js-client";

import { CreateTransactionDocumentParameters } from "./request";
import { TransactionService } from "./transaction-service";
import { WalletClient } from "@common/clients/wallet-client";
import { Document } from "src/types/transaction-messages.types";
import { CommonError } from "@common/errors";
import { EncodeTxSignature } from "./types";

import { GasToken } from "@common/values/token-constant";
import { mappedDocumentMessagesWithCaller } from "@utils/messages.utils";
import { isContractMessage } from "@common/clients/wallet-client/protocols";
import { makeMsgCallMessage, makeMsgSendMessage } from "@adena-wallet/sdk";

export class TransactionServiceImpl implements TransactionService {
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(rpcProvider: GnoProvider | null, walletClient: WalletClient | null) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  public createDocument = async ({
    messages,
    // gasFee,
    // gasWanted,
    memo,
    account,
  }: CreateTransactionDocumentParameters): Promise<Document> => {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const accountInfo = account ? null : await this.walletClient.getAccount();
    const accountNumber = account?.accountNumber ?? accountInfo?.data?.accountNumber ?? 0;
    const accountSequence = account?.sequence ?? accountInfo?.data?.sequence ?? 0;
    const caller = account?.address ?? accountInfo?.data?.address ?? "";

    const processedMsgs = messages.map(message => {
      if (isContractMessage(message)) {
        return makeMsgCallMessage({
          ...message,
          max_deposit: "0ugnot",
          args: message.args?.map(arg => `${arg}`) || [],
        });
      }
      return makeMsgSendMessage(message);
    });

    return {
      msgs: mappedDocumentMessagesWithCaller(processedMsgs, caller),
      fee: {
        amount: [{ amount: "", denom: GasToken.denom as string }],
        gas: "",
      },
      chain_id: "",
      account_number: accountNumber.toString(),
      sequence: accountSequence.toString(),
      memo: memo || "",
    };
  };

  public createTransaction = async (document: Document): Promise<{ signed: Tx; signature: EncodeTxSignature[] }> => {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const { signed, signature } = await this.walletClient.sign(this.rpcProvider, document);

    const encodedSignature = (signature || []).map(s => ({
      pubKey: {
        typeUrl: s?.pub_key?.type_url,
        value: s?.pub_key?.value ? uint8ArrayToBase64(s.pub_key.value as Uint8Array) : undefined,
      },
      signature: uint8ArrayToBase64(s.signature),
    }));

    return {
      signed,
      signature: encodedSignature,
    };
  };
}
