import { NetworkClient } from "@common/clients/network-client";
import {
  HttpDeleteRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "@common/clients/network-client/protocols";
import { TokenModel } from "@models/token/token-model";

import { GetRoutesResponse } from "./response/get-routes-response";
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

const createNetworkClient = (post: jest.Mock, response: GetRoutesResponse): NetworkClient => ({
  get: async <R>(): Promise<HttpResponse<R>> => ({ status: 200, message: "", data: response as R }),
  post: async <_T, R>(params: HttpPostRequestParam<_T>): Promise<HttpResponse<R>> => {
    post(params);
    return { status: 200, message: "", data: response as R };
  },
  put: async <T, R>(params: HttpPutRequestParam<T>): Promise<HttpResponse<R>> => {
    void params;
    return { status: 200, message: "", data: response as R };
  },
  delete: async <T, R>(params: HttpDeleteRequestParam<T>): Promise<HttpResponse<R>> => {
    void params;
    return { status: 200, message: "", data: response as R };
  },
});

describe("SwapRouterRepositoryImpl", () => {
  it("sends the exact raw amount for a balance above Number.MAX_SAFE_INTEGER", async () => {
    // Regression: on-chain USDC balance 62667447936264477 was rounded to ...480 via Number()
    const post = jest.fn();
    const repository = new SwapRouterRepositoryImpl(
      null,
      null,
      createNetworkClient(post, { estimatedRoutes: [], originAmount: 0, amount: "0", status: "SUCCESS" }),
    );

    await repository.getRoutes({
      inputToken: createToken("USDC", 6),
      outputToken: createToken("ATOM", 6),
      tokenAmount: "62667447936.264477",
      exactType: "EXACT_IN",
    });

    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          amount: "62667447936264477",
        }),
      }),
    );
  });

  it("uses output token decimals for exact-out route quotes", async () => {
    const response: GetRoutesResponse = {
      estimatedRoutes: [],
      originAmount: 0,
      amount: "0",
      status: "SUCCESS",
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

    await repository.getRoutes({
      inputToken: createToken("IN", 6),
      outputToken: createToken("OUT", 8),
      tokenAmount: 1.23,
      exactType: "EXACT_OUT",
    });

    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          amount: "123000000",
        }),
      }),
    );
  });
});
