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
import { IBalancesByAddressResponse } from "@repositories/token/response/balance-by-address-response";
import { TokenError } from "@common/errors/token";

export const useGetTokensList = (
  options?: UseQueryOptions<TokenListResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenListResponse, Error>({
    queryKey: [QUERY_KEY.tokens],
    queryFn: () => tokenRepository.getTokens(),
    staleTime: Infinity,
    refetchInterval: false,
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
      const priceMap = res.data.reduce<Record<string, TokenPriceModel>>(
        (prev, current) => {
          prev[current.path] = current;
          return prev;
        },
        {},
      );
      return priceMap;
    },
    refetchInterval: options?.refetchInterval || 10_000,
    ...options,
  });
};

export const useGetTokenPricesByPath = (
  path: string | null,
  options?: UseQueryOptions<TokenPriceModel, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenPriceModel, Error>({
    queryKey: [QUERY_KEY.tokenPrices, path],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenPricesByPath(path);
    },
    ...options,
  });
};

export const useGetTokenDetailByPath = (
  path: string | null,
  option?: UseQueryOptions<ITokenDetailResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<ITokenDetailResponse, Error>({
    queryKey: [QUERY_KEY.tokenDetails, path],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenDetailByPath(path);
    },
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
    refetchInterval: 10_000,
    ...option,
  });
};

export const useGetTokenByPath = (
  path: string | null,
  option?: UseQueryOptions<ITokenResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<ITokenResponse, Error>({
    queryKey: [QUERY_KEY.tokenByPath, path],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenByPath(path);
    },
    staleTime: Infinity,
    refetchInterval: false,
    ...option,
  });
};

export const useGetBalancesByAddress = (
  address: string,
  option?: UseQueryOptions<IBalancesByAddressResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<IBalancesByAddressResponse, Error>({
    queryKey: [QUERY_KEY.tokenBalancesByAddress, address],
    queryFn: () => tokenRepository.getBalancesByAddress(address),
    ...option,
  });
};
