import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { CommonError } from "@common/errors";
import { APIResponse } from "@repositories/common";
import { makeQueryParameter } from "@utils/network.utils";
import { SwapHistoryRequest } from "./request/swap-history-request";
import { SwapHistoryResponse } from "./response/swap-history-response";
import { SwapRepository } from "./swap-repository";

export class SwapRepositoryImpl implements SwapRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;

  constructor(networkClinet: NetworkClient | null, walletClient: WalletClient | null) {
    this.networkClient = networkClinet;
    this.walletClient = walletClient;
  }

  public getSwapHistory = async (params: SwapHistoryRequest): Promise<SwapHistoryResponse[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<SwapHistoryResponse[]>>({
        url: `/swap/history${requestParams}`,
      })
      .then(result => result.data?.data);
  };
}
