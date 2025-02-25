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
    value: { caller: string; send: string; pkg_path: string; func: string; args: string[] };
  }[];
  memo: string;
}

export interface TransactionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: readonly any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contracts: { type: string; function: string; value: any }[];
  gasWanted: string;
  gasFee: string;
  memo: string;
  document: Document;
}
