import { FaucetRepository } from "@repositories/faucet";
import { FaucetService } from "./faucet-service";
import { FaucetResponse } from "@repositories/faucet/response";
import { FaucetTokenType } from "@repositories/faucet/type";

export class FaucetServiceImpl implements FaucetService {
  private faucetRepository: FaucetRepository;

  constructor(faucetRepository: FaucetRepository) {
    this.faucetRepository = faucetRepository;
  }

  public availFaucet(chainId: string, tokenType: FaucetTokenType): boolean {
    return this.faucetRepository.existsFaucetApi(chainId, tokenType);
  }

  public getFaucetApiUrl(chainId: string, tokenType: FaucetTokenType): string {
    const apiUrl = this.faucetRepository.findFaucetApiUrl(chainId, tokenType);
    if (!apiUrl) {
      throw new Error(`This chain does not support ${tokenType} Faucet`);
    }
    return apiUrl;
  }

  public async faucetGRC20(chainId: string, to: string, amount: string): Promise<FaucetResponse> {
    const apiUrl = this.getFaucetApiUrl(chainId, "grc20");
    return this.faucetRepository.postFaucetGRC20(apiUrl, {
      to,
      amount,
    });
  }

  public async faucetNative(chainId: string, to: string, amount: string): Promise<FaucetResponse> {
    const apiUrl = this.getFaucetApiUrl(chainId, "native");
    return this.faucetRepository.postFaucetNative(apiUrl, {
      to,
      amount,
    });
  }
}
