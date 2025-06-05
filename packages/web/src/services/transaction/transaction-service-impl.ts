import { TransactionService } from "./transaction-service";
import { WalletClient } from "@common/clients/wallet-client";

import { CommonError } from "@common/errors";
import { Document } from "src/types/transaction-messages.types";
import { CreateTransactionDocumentParameters } from "./request";
import { GasToken } from "@common/values/token-constant";

export class TransactionServiceImpl implements TransactionService {
  private walletClient: WalletClient | null;

  constructor(walletClient: WalletClient | null) {
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
}
