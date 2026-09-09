import { NetworkClient } from "@common/clients/network-client";
import {
  HttpDeleteRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "@common/clients/network-client/protocols";
import { TokenModel } from "@models/token/token-model";

import { SwapRouterRepositoryImpl } from "./swap-router-repository-impl";

const createToken = (symbol: string, decimals: number): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  type: "GRC20",
  chainId: "dev.gnoswap",
  name: symbol,
  symbol,
  displaySymbol: symbol,
  decimals,
  logoURI: "",
  createdAt: "2026-05-19T00:00:00Z",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

describe("SwapRouterRepositoryImpl", () => {
  it.each(["SUCCESS", "NO_LIQUIDITY", "INVALID_PARAMS"] as const)(
    "uses output token decimals and normalizes %s route responses",
    async status => {
      const response = {
        estimatedRoutes: [],
        originAmount: 0,
        amount: "0",
        status,
      };
      const post = jest.fn();
      const networkClient: NetworkClient = {
        get: async <R>(): Promise<HttpResponse<R>> => ({ status: 200, message: "", data: response as R }),
        post: async <_T, R>(params: HttpPostRequestParam<_T>): Promise<HttpResponse<R>> => {
          post(params);
          return { status: 200, message: "", data: response as R };
        },
        put: async <T, R>(params: HttpPutRequestParam<T>): Promise<HttpResponse<R>> => {
          void params;
          return {
            status: 200,
            message: "",
            data: response as R,
          };
        },
        delete: async <T, R>(params: HttpDeleteRequestParam<T>): Promise<HttpResponse<R>> => {
          void params;
          return {
            status: 200,
            message: "",
            data: response as R,
          };
        },
      };
      const repository = new SwapRouterRepositoryImpl(null, null, networkClient);

      const result = await repository.getRoutes({
        inputToken: createToken("IN", 6),
        outputToken: createToken("OUT", 8),
        tokenAmount: 1.23,
        exactType: "EXACT_OUT",
      });

      expect(result).toEqual(status === "SUCCESS" ? response : { status });

      expect(post).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            amount: "123000000",
          }),
        }),
      );
    },
  );
});
