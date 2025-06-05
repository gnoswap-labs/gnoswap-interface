export interface CreateTransactionDocumentParameters {
  messages: {
    type: string;
    value: { caller: string; send: string; pkg_path: string; func: string; args: string[] };
  }[];
  gasWanted?: number;
  gasFee?: number;
  memo?: string | undefined;
}
