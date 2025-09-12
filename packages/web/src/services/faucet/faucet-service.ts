import { FaucetResponse } from "@repositories/faucet/response";
import { FaucetTokenType } from "@repositories/faucet/type";

export interface FaucetService {
  availFaucet: (chainId: string, tokenType: FaucetTokenType) => boolean;

  getFaucetApiUrl: (chainId: string, tokenType: FaucetTokenType) => string;

  faucetGRC20: (chainId: string, to: string, amount: string) => Promise<FaucetResponse>;

  faucetNative: (chainId: string, to: string, amount: string) => Promise<FaucetResponse>;
}
