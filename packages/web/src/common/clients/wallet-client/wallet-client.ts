import {
  WalletStatusMethod,
  WalletTransactionMethod,
  WalletAccountMethod,
  WalletEventMethod,
  WalletNetworkMethod,
} from "./protocols";

export interface WalletClient
  extends WalletStatusMethod,
    WalletTransactionMethod,
    WalletAccountMethod,
    WalletNetworkMethod,
    WalletEventMethod {}
