import { FaucetTokenType } from "./type";

import { FaucetRequest } from "./request";
import { FaucetResponse } from "./response";

export interface FaucetRepository {
  existsFaucetApi: (chainId: string, tokenType: FaucetTokenType) => boolean;

  findFaucetApiUrl: (chainId: string, tokenType: FaucetTokenType) => string | null;

  postFaucetGRC20: (requestUrl: string, request: FaucetRequest) => Promise<FaucetResponse>;

  postFaucetNative: (requestUrl: string, request: FaucetRequest) => Promise<FaucetResponse>;
}
