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
  email?: string;
}

export const DEFAULT_ACCOUNT_INFO: AccountInfo = {
  address: "",
  coins: "0ugnot",
  chainId: "",
  status: "IN_ACTIVE",
  publicKey: {
    "@type": "",
    value: "",
  },
  accountNumber: 0,
  sequence: 0,
};
