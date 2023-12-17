import { IChainResponse, ITokenDetailResponse, ITokenResponse, TokenListResponse, TokenPriceListResponse } from "@repositories/token";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./types";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

export const useGetTokensList = (
  options?: UseQueryOptions<TokenListResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenListResponse, Error>({
    queryKey: [QUERY_KEY.tokens],
    queryFn: () => tokenRepository.getTokens(),
    ...options,
  });
};

export const useGetTokenPrices = (
  options?: UseQueryOptions<TokenPriceListResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<TokenPriceListResponse, Error>({
    queryKey: [QUERY_KEY.tokenPrices],
    queryFn: () => tokenRepository.getTokenPrices(),
    ...options,
  });
};

export const useGetTokenDetailByPath = (
  path: string,
  option?: UseQueryOptions<ITokenDetailResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<ITokenDetailResponse, Error>({
    queryKey: [QUERY_KEY.tokenDetails, path],
    queryFn: () => tokenRepository.getTokenDetailByPath(path),
    ...option,
  });
};

export const useGetChainList = (
  option?: UseQueryOptions<IChainResponse, Error>
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
