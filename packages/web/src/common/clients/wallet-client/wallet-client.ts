import { SocialLoginType, WalletType } from "src/types/wallet.types";
import {
  WalletAccountMethod,
  WalletEventMethod,
  WalletNetworkMethod,
  WalletSignMethod,
  WalletStatusMethod,
  WalletTransactionMethod,
} from "./protocols";

export interface WalletClient
  extends WalletStatusMethod,
    WalletTransactionMethod,
    WalletSignMethod,
    WalletAccountMethod,
    WalletNetworkMethod,
    WalletEventMethod {
  getAddress: () => Promise<string | null>;
  getWalletType(): WalletType;
  getLoginType?(): SocialLoginType | null;
  getUserEmail?(): Promise<string>;
  disconnect(): Promise<void>;
}
