import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import {
  IChainResponse,
  ITokenDetailResponse,
  ITokenResponse,
  TokenListResponse,
  TokenPriceListResponse,
  TokenSearchLogListResponse,
} from "./response";
import { IBalancesByAddressResponse, IGrc20TransferHistoryResponse } from "./response/balance-by-address-response";
import { TokenExchangeRateGraphResponse } from "./response/token-exchange-rate-response";

export interface TokenRepository {
  getTokens: (showUnverified: boolean) => Promise<TokenListResponse>;

  getTokenByPath: (path: string) => Promise<ITokenResponse>;

  getTokenPrices: () => Promise<TokenPriceListResponse>;

  getTokenPricesByPath: (path: string) => Promise<TokenPriceModel>;

  getTokenDetailByPath: (path: string) => Promise<ITokenDetailResponse>;

  createSearchLog: (searchLog: TokenSearchLogModel) => Promise<boolean>;

  getSearchLogs: () => Promise<TokenSearchLogListResponse>;

  clearSearchLogs: () => Promise<boolean>;

  getChain: () => Promise<IChainResponse>;

  getExchangeRateGraph: () => Promise<TokenExchangeRateGraphResponse>;

  getGrc20BalancesByAddress: (address: string) => Promise<IBalancesByAddressResponse>;

  getGrc20TransferHistoryByTxHash: (txHash: string, tokenPath: string) => Promise<IGrc20TransferHistoryResponse>;
}
