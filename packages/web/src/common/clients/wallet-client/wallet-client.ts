import {
  InjectEstablishRequest,
  InjectExistsRequest,
  InjectGetAccountRequest,
  InjectSendTransactionRequest,
} from "./protocols";

export interface WalletClient
  extends InjectEstablishRequest,
    InjectExistsRequest,
    InjectSendTransactionRequest,
    InjectGetAccountRequest {}
