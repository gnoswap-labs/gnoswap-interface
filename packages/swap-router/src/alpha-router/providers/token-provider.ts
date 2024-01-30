import { ChainId, Token } from "../core";
import { mapTokenByResponse } from "./mapper/token-mapper";
import { TokenResponse } from "./response/token-response";

/**
 * Provider for getting token data.
 *
 * @export
 * @interface ITokenProvider
 */
export interface ITokenProvider {
  /**
   * Gets the token at each address. Any addresses that are not valid ERC-20 are ignored.
   *
   * @param addresses The token addresses to get.
   * @param [providerConfig] The provider config.
   * @returns A token accessor with methods for accessing the tokens.
   */
  getTokens(addresses: string[]): Promise<TokenAccessor>;
}

export type TokenAccessor = {
  getTokenByAddress(address: string): Token | undefined;
  getTokenBySymbol(symbol: string): Token | undefined;
  getAllTokens: () => Token[];
};

export class TokenProvider implements ITokenProvider {
  private fetchUri: string;

  constructor(chainId: ChainId) {
    switch (chainId) {
      case ChainId.BETA_GNOSWAP:
        this.fetchUri = "https://beta.api.gnoswap.io/v3/testnet";
        break;
      default:
        this.fetchUri = "https://dev.api.gnoswap.io/v3/testnet";
    }
  }

  public async getTokens(): Promise<TokenAccessor> {
    const tokens = await this.fetchTokens();
    return {
      getTokenByAddress: (address: string): Token | undefined => {
        return tokens.find(token => token.address === address);
      },
      getTokenBySymbol: (symbol: string): Token | undefined => {
        return tokens.find(token => token.symbol === symbol);
      },
      getAllTokens: (): Token[] => {
        return tokens;
      },
    };
  }

  private async fetchTokens(): Promise<Token[]> {
    const requestUrl = this.fetchUri + "/tokens";
    return fetch(requestUrl)
      .then(response => response.json())
      .then(json => (json.tokens as TokenResponse[]).map(mapTokenByResponse))
      .catch(e => {
        console.log(e);
        return [];
      });
  }
}
