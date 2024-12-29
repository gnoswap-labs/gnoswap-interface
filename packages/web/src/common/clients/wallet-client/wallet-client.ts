import { WalletType } from "src/types/wallet.types";
import {
  WalletAccountMethod,
  WalletEventMethod,
  WalletNetworkMethod,
  WalletStatusMethod,
  WalletTransactionMethod,
} from "./protocols";

export interface WalletClient
  extends WalletStatusMethod,
    WalletTransactionMethod,
    WalletAccountMethod,
    WalletNetworkMethod,
    WalletEventMethod {
  getAddress: () => Promise<string | null>;
  getWalletType(): WalletType;
}
