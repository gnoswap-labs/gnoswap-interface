import {
  WalletStatusMethod,
  WalletTransactionMethod,
  WalletAccountMethod,
  WalletEventMethod,
} from "./protocols";

export interface WalletClient
  extends WalletStatusMethod,
    WalletTransactionMethod,
    WalletAccountMethod,
    WalletEventMethod {}
