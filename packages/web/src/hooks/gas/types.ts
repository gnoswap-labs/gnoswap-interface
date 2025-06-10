export interface GasInfo {
  gasFee: number;
  gasUsed: number;
  gasWanted: number;
  gasPrice: number;
  hasError?: boolean;
  simulateErrorMessage: string | null;
}

export interface NetworkFee {
  amount: string;
  denom: string;
  usdValue?: string;
}
