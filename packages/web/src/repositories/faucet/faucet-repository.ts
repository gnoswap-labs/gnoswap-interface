export interface FaucetRepository {
  faucetGNOT: (address: string) => Promise<boolean>;

  faucetTokens: (address: string) => Promise<boolean>;
}
