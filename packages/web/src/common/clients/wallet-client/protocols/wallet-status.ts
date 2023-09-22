import { WalletResponse } from "./wallet-response";

export interface WalletStatusMethod {
  existsWallet: () => boolean;

  addEstablishedSite: (sitename: string) => Promise<WalletResponse>;
}
