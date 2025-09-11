import { FaucetRepository } from "@repositories/faucet";
import { FaucetService } from "./faucet-service";
import { FaucetResponse } from "@repositories/faucet/response";

export class FaucetServiceImpl implements FaucetService {
  private faucetRepository: FaucetRepository;

  constructor(faucetRepository: FaucetRepository) {
    this.faucetRepository = faucetRepository;
  }

  public availFaucet(chainId: string): boolean {
    return this.faucetRepository.existsFaucetApi(chainId);
  }

  public getFaucetApiUrl(chainId: string): string {
    const apiUrl = this.faucetRepository.findFaucetApiUrl(chainId);
    if (!apiUrl) {
      throw new Error("This chain does not support Faucet");
    }
    return apiUrl;
  }

  public async faucetGRC20(chainId: string, to: string, amount: string): Promise<FaucetResponse> {
    const apiUrl = this.getFaucetApiUrl(chainId);
    return this.faucetRepository.postFaucetGRC20(apiUrl, {
      to,
      amount,
    });
  }
}
