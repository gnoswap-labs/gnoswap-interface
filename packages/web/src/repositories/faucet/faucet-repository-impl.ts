import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { FaucetRepository } from "./faucet-repository";
import { FaucetRequest } from "./request";
import { FaucetResponse } from "./response";
import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";

import FaucetEndPoints from "./resources/faucet-api.json";

interface JsonRpcSuccessResponse {
  jsonrpc: "2.0";
  id: number;
  result: string;
}

interface JsonRpcErrorResponse {
  jsonrpc: "2.0";
  id: number;
  error: {
    message: string;
    code: number;
  };
}

type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

type FaucetApiResponse = JsonRpcResponse | string;

export class FaucetRepositoryImpl implements FaucetRepository {
  private networkClient: AxiosInstance;
  private faucetEndpoints: Record<string, string>;

  constructor(networkClient: AxiosInstance) {
    this.networkClient = networkClient;
    this.faucetEndpoints = { ...FaucetEndPoints };
  }

  public existsFaucetApi(chainId: string): boolean {
    return !!(this.faucetEndpoints && this.faucetEndpoints[chainId]);
  }

  public findFaucetApiUrl(chainId: string): string | null {
    return this.faucetEndpoints[chainId] || null;
  }

  public async postFaucetGRC20(requestUrl: string, requests: FaucetRequest): Promise<FaucetResponse> {
    if (!this.networkClient) {
      return {
        success: false,
        message: FAUCET_RESPONSE_MESSAGE.ERROR.NETWORK_CLIENT,
      };
    }

    const jsonRpcRequest = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "drip",
      params: [requests.to, requests.amount.toString()],
    };

    try {
      const response: AxiosResponse<FaucetApiResponse> = await this.networkClient.post(requestUrl, jsonRpcRequest, {
        headers: { "Content-Type": "application/json" },
      });

      return this.handleFaucetResponse(response);
    } catch (error) {
      return this.handleFaucetError(error);
    }
  }

  private handleFaucetResponse(response: AxiosResponse<FaucetApiResponse>): FaucetResponse {
    const data = response?.data;

    if (this.isJsonRpcSuccessResponse(data)) {
      return {
        success: true,
        message: FAUCET_RESPONSE_MESSAGE.SUCCESS.MESSAGE,
      };
    }

    if (this.isJsonRpcErrorResponse(data)) {
      return {
        success: false,
        message: data.error.message,
      };
    }

    if (typeof data === "string") {
      return {
        success: false,
        message: data,
      };
    }

    return {
      success: false,
      message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
    };
  }

  private handleFaucetError(error: unknown): FaucetResponse {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response.data as string,
        };
      }

      if (error.response?.data) {
        const data = error.response.data;

        if (this.isJsonRpcErrorResponse(data)) {
          return {
            success: false,
            message: data.error.message,
          };
        }

        if (typeof data === "string") {
          return {
            success: false,
            message: data,
          };
        }
      }
    }

    return {
      success: false,
      message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
    };
  }

  private isJsonRpcSuccessResponse(data: FaucetApiResponse): data is JsonRpcSuccessResponse {
    return typeof data === "object" && data !== null && "jsonrpc" in data && "result" in data;
  }

  private isJsonRpcErrorResponse(data: FaucetApiResponse): data is JsonRpcErrorResponse {
    return typeof data === "object" && data !== null && "error" in data;
  }
}
