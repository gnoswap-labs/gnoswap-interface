import { FaucetRequest } from "./request";
import { FaucetResponse } from "./response";

export interface FaucetRepository {
  existsFaucetApi: (chainId: string) => boolean;

  findFaucetApiUrl: (chainId: string) => string | null;

  postFaucet: (requestUrl: string, request: FaucetRequest) => Promise<FaucetResponse>;

  postFaucetGRC20: (requestUrl: string, request: FaucetRequest) => Promise<FaucetResponse>;
}
