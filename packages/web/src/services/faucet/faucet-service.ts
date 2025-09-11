import { FaucetResponse } from "@repositories/faucet/response";

export interface FaucetService {
  availFaucet: (chainId: string) => boolean;

  faucetGRC20: (chainId: string, to: string, amount: string) => Promise<FaucetResponse>;

  getFaucetApiUrl: (chainId: string) => string;
}
