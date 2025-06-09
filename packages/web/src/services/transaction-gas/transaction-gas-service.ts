import { Tx } from "@gnolang/tm2-js-client";

export interface TransactionGasService {
  getGasPrices: () => Promise<number | null>;

  estimateGas(tx: Tx): Promise<number>;
}
