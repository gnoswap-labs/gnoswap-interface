import { WalletResponse } from "./wallet-response";

export interface WalletAccountMethod {
  getAccount: () => Promise<WalletResponse<AccountInfo>>;
}

export interface AccountInfo {
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
