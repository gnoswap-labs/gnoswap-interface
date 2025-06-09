export interface GasInfo {
  gasFee: number;
  gasUsed: number;
  gasWanted: number;
  gasPrice: number;
  hasError?: boolean;
  simulateErrorMessage: string | null;
}
