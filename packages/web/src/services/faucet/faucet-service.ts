import { FaucetResponse } from "@repositories/faucet/response";

export interface FaucetService {
  availFaucet: (chainId: string) => boolean;

  faucet: (chainId: string, to: string, amount: string) => Promise<FaucetResponse>;

  faucetGRC20: (chainId: string, to: string, amount: string) => Promise<FaucetResponse>;

  getFaucetApiUrl: (chainId: string) => string;
}
