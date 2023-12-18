export interface Adena {
  AddEstablish: (name: string) => Promise<Response>;
  GetAccount: () => Promise<Response<AccountInfo>>;
  DoContract: (
    mesasage: SendTransactionRequestParam,
  ) => Promise<Response<AdenaSendTransactionResponse>>;
  Sign: (mesasage: SendTransactionRequestParam) => Promise<Response>;
  AddNetwork: (
    chain: AdenaAddNetworkRequestParam,
  ) => Promise<Response<AdenaAddNetworkResponse>>;
  SwitchNetwork: (
    chainId: string,
  ) => Promise<Response<AdenaSwitchNetworkResponse>>;
  On: (eventName: string, callback: (message: string) => void) => void;
}

interface Response<T = {}> {
  code: number;
  status: string;
  type: string;
  message: string;
  data: T;
}

interface AccountInfo {
  status: "ACTIVE" | "IN_ACTIVE";
  address: string;
  coins: string;
  publicKey: {
    "@type": string;
    value: string;
  };
  accountNumber: number;
  sequence: number;
  chainId: string;
}

interface SendTransactionRequestParam {
  messages: TransactionMessageForm<TransactionMessage>[];
  gasFee: number;
  gasWanted: number;
  memo?: string;
}

/**
 * Transaction Request Message
 */
type TransactionMessage =
  | TransactionMessageOfBankMsgSend
  | TransactionMessageOfContract;

interface TransactionMessageForm<T> {
  type: string;
  value: T;
}

interface TransactionMessageOfBankMsgSend {
  from_address: string;
  to_address: string;
  amount: string;
}

interface TransactionMessageOfContract {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: (string | number | boolean)[] | null;
}

/**
 * Send Transaction Response
 */
export type AdenaSendTransactionResponse =
  | AdenaSendTransactionSuccessResponse
  | AdenaSendTransactionErrorResponse;

export interface AdenaSendTransactionSuccessResponse {
  hash: string;
  height: string;
  check_tx: AdenaSendTransactionSuccessResponseTransaction;
  deliver_tx: AdenaSendTransactionSuccessResponseTransaction;
}

export interface AdenaSendTransactionSuccessResponseTransaction {
  ResponseBase: {
    Error: string | null;
    Data: string | null;
    Events: unknown[];
    Log: string | null;
    Info: string | null;
  };
  GasWanted: string;
  GasUsed: string;
}

export interface AdenaSendTransactionErrorResponse {
  type: string;
  message: string;
}

export interface AdenaAddNetworkRequestParam {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

export interface AdenaAddNetworkResponse {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

export interface AdenaSwitchNetworkResponse {
  chainId: string;
}
