export type GasInfo =
  | {
      status: "success";
      gasFee: number;
      gasUsed: number;
      gasWanted: number;
      gasPrice: number;
    }
  | {
      status: "error";
      simulateErrorMessage: string;
    };

export interface NetworkFee {
  amount: string;
  denom: string;
  usdValue?: string;
}
