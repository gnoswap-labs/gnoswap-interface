import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { FaucetRepository } from "./faucet-repository";
import { NetworkClient } from "@common/clients/network-client";
import { makeFaucetMessage } from "@common/clients/wallet-client/transaction-messages/faucet";

export class FaucetRepositoryImpl implements FaucetRepository {
  private networkClient: NetworkClient;

  private walletClient: WalletClient | null;

  constructor(networkClient: NetworkClient, walletClient: WalletClient | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
  }

  async faucetGNOT(address: string): Promise<boolean> {
    const response = await this.networkClient
      .post({
        url: "/",
        body: {
          To: address,
        },
      })
      .catch(() => null);
    return response !== null;
  }

  async faucetTokens(address: string): Promise<boolean> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_ENVIRONMENT");
    }

    const messages = [];
    messages.push(makeFaucetMessage(address));
    const result = await this.walletClient
      .sendTransaction({
        messages,
        gasFee: DEFAULT_GAS_FEE,
        gasWanted: DEFAULT_GAS_WANTED,
      })
      .catch(() => null);
    return result !== null;
  }
}
