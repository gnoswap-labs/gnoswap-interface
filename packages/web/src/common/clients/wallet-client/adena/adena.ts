export interface Adena {
  AddEstablish: (name: string) => Promise<Response>;
  GetAccount: () => Promise<Response<AccountInfo>>;
  DoContract: (
    mesasage: SendTransactionRequestParam,
  ) => Promise<Response<SendTransactionResponse>>;
  Sign: (mesasage: SendTransactionRequestParam) => Promise<Response>;
  AddNetwork: (
    chain: AddNetworkRequestParam,
  ) => Promise<Response<AddNetworkResponse>>;
  SwitchNetwork: (chainId: string) => Promise<Response<SwitchNetworkResponse>>;
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
  messages: Array<TransactionMessage>;
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
  args: string[];
}

/**
 * Send Transaction Response
 */
type SendTransactionResponse =
  | SendTransactionSuccessResponse
  | SendTransactionErrorResponse;

interface SendTransactionSuccessResponse {
  hash: string;
}

interface SendTransactionErrorResponse {
  type: string;
  message: string;
}

interface AddNetworkRequestParam {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

interface AddNetworkResponse {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

interface SwitchNetworkResponse {
  chainId: string;
}
