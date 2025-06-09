import { GnoProvider } from "@gnolang/gno-js-client";
import { Tx, uint8ArrayToBase64 } from "@gnolang/tm2-js-client";

import { CreateTransactionDocumentParameters } from "./request";
import { TransactionService } from "./transaction-service";
import { WalletClient } from "@common/clients/wallet-client";
import { Document } from "src/types/transaction-messages.types";
import { CommonError } from "@common/errors";
import { EncodeTxSignature } from "./types";

import { GasToken } from "@common/values/token-constant";

export class TransactionServiceImpl implements TransactionService {
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(rpcProvider: GnoProvider | null, walletClient: WalletClient | null) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  public createDocument = async ({
    // messages,
    // gasFee,
    // gasWanted,
    memo,
  }: CreateTransactionDocumentParameters): Promise<Document> => {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const accountInfo = await this.walletClient.getAccount();
    const accountNumber = accountInfo?.data?.accountNumber ?? 0;
    const accountSequence = accountInfo?.data?.sequence ?? 0;

    return {
      msgs: [],
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
    const encodedSignature = signature.map(s => ({
      pubKey: {
        typeUrl: s?.pubKey?.typeUrl,
        value: s?.pubKey?.value ? uint8ArrayToBase64(s.pubKey.value as Uint8Array) : undefined,
      },
      signature: uint8ArrayToBase64(s.signature),
    }));

    return {
      signed,
      signature: encodedSignature,
    };
  };
}
