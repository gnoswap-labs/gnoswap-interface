export interface WalletEventMethod {
  addEventChangedAccount: (callback: (accountId: string) => void) => void;

  addEventChangedNetwork: (callback: (networkId: string) => void) => void;
}
