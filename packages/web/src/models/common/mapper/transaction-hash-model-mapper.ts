import { TransactionHashModel } from "@models/common/transaction-hash-model";

export class TransactionHashModelMapper {
  public static fromResponse(response: {
    tx_hash: string;
  }): TransactionHashModel {
    const txHash = response.tx_hash;
    return {
      txHash,
    };
  }
}
