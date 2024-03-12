import {
  IChainResponse,
  ITokenDetailResponse,
  ITokenResponse,
  TokenListResponse,
} from "@repositories/token";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./types";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenPriceModel } from "@models/token/token-price-model";
import { IBalancesByAddressReponse } from "@repositories/token/response/balance-by-address-response";

export const useGetTokensList = (
  options?: UseQueryOptions<TokenListResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenListResponse, Error>({
    queryKey: [QUERY_KEY.tokens],
    queryFn: () => tokenRepository.getTokens(),
    ...options,
  });
};

export const useGetTokenPrices = (
  options?: UseQueryOptions<Record<string, TokenPriceModel>, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<Record<string, TokenPriceModel>, Error>({
    queryKey: [QUERY_KEY.tokenPrices],
    queryFn: async () => {
      const res = await tokenRepository.getTokenPrices();
      const priceMap = res.prices.reduce<Record<string, TokenPriceModel>>(
        (prev, current) => {
          prev[current.path] = current;
          return prev;
        },
        {},
      );
      return priceMap;
    },
    ...options,
  });
};

export const useGetTokenDetailByPath = (
  path: string,
  option?: UseQueryOptions<ITokenDetailResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<ITokenDetailResponse, Error>({
    queryKey: [QUERY_KEY.tokenDetails, path],
    queryFn: () => tokenRepository.getTokenDetailByPath(path),
    ...option,
  });
};

export const useGetChainList = (
  option?: UseQueryOptions<IChainResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<IChainResponse, Error>({
    queryKey: [QUERY_KEY.chain],
    queryFn: () => tokenRepository.getChain(),
    ...option,
  });
};

export const useGetTokenByPath = (
  path: string,
  option?: UseQueryOptions<ITokenResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<ITokenResponse, Error>({
    queryKey: [QUERY_KEY.tokenByPath, path],
    queryFn: () => tokenRepository.getTokenByPath(path),
    ...option,
  });
};

export const useGetBalancesByAddress = (
  address: string,
  option?: UseQueryOptions<IBalancesByAddressReponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<IBalancesByAddressReponse, Error>({
    queryKey: [QUERY_KEY.tokenBalancesByAddress, address],
    queryFn: () => tokenRepository.getBalancesByAddress(address),
    ...option,
  });
};
