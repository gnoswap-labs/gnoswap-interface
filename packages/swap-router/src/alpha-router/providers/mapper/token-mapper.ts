import { Token } from "../../core";
import { NAME_TO_CHAIN_ID } from "../../utility";
import { TokenResponse } from "../response/token-response";

export function mapTokenByResponse(tokenResponse: TokenResponse): Token {
  const { chainId, path, symbol, name, wrappedPath, decimals } = tokenResponse;
  const tokenAddress = wrappedPath || path;

  return new Token(
    NAME_TO_CHAIN_ID(chainId),
    tokenAddress,
    decimals,
    symbol,
    name,
  );
}
