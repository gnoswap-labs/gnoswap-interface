import { GnoProvider } from "@gnolang/gno-js-client";
import { Tx } from "@gnolang/tm2-js-client";

import { TransactionGasService } from "./transaction-gas-service";
import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";

export class TransactionGasServiceImpl implements TransactionGasService {
  private rpcProvider: GnoProvider | null;
  private walletClient: WalletClient | null;

  constructor(rpcProvider: GnoProvider | null, walletClient: WalletClient | null) {
    this.rpcProvider = rpcProvider;
    this.walletClient = walletClient;
  }

  public async getGasPrices(): Promise<number | null> {
    if (!this.rpcProvider) return null;

    const gasPrice = await this.rpcProvider.getGasPrice();
    if (!gasPrice) return null;

    return gasPrice;
  }

  public async estimateGas(tx: Tx): Promise<number> {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    return this.rpcProvider.estimateGas(tx);
  }
}
