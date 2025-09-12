import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";
import { generateJsonRpcRequestId } from "@utils/common";

import { FaucetRepository } from "./faucet-repository";
import { FaucetRequest, FaucetGRC20Request, FaucetNativeRequest } from "./request";
import {
  FaucetResponse,
  FaucetGRC20Response,
  FaucetGRC20SuccessResponse,
  FaucetGRC20ErrorResponse,
  FaucetNativeResponse,
  FaucetNativeSuccessResponse,
  FaucetNativeErrorResponse,
} from "./response";
import { FaucetTokenType } from "./type";

import FaucetEndPointsResource from "./resources/faucet-api.json";

type FaucetEndpoint = Record<FaucetTokenType, string | null>;
type FaucetEndpoints = Record<string, FaucetEndpoint>;

export class FaucetRepositoryImpl implements FaucetRepository {
  private networkClient: AxiosInstance;
  private faucetEndpoints: FaucetEndpoints;

  constructor(networkClient: AxiosInstance) {
    this.networkClient = networkClient;
    this.faucetEndpoints = { ...FaucetEndPointsResource };
  }

  public existsFaucetApi(chainId: string, tokenType: FaucetTokenType): boolean {
    const endpoint = this.faucetEndpoints[chainId];
    return !!(endpoint && endpoint[tokenType]);
  }

  public findFaucetApiUrl(chainId: string, tokenType: FaucetTokenType): string | null {
    const endpoint = this.faucetEndpoints[chainId];
    return endpoint?.[tokenType] || null;
  }

  // GRC20 Faucet (JSON-RPC)
  public async postFaucetGRC20(requestUrl: string, requests: FaucetRequest): Promise<FaucetResponse> {
    if (!this.networkClient) {
      return {
        success: false,
        message: FAUCET_RESPONSE_MESSAGE.ERROR.NETWORK_CLIENT,
      };
    }

    const jsonRpcRequest: FaucetGRC20Request = {
      jsonrpc: "2.0",
      id: generateJsonRpcRequestId(),
      method: "drip",
      params: [requests.to, requests.amount.toString()],
    };

    try {
      const response: AxiosResponse<FaucetGRC20Response> = await this.networkClient.post(requestUrl, jsonRpcRequest, {
        headers: { "Content-Type": "application/json" },
      });

      return this.handleFaucetGRC20Response(response);
    } catch (error) {
      return this.handleFaucetError(error);
    }
  }

  // Native Faucet (REST API)
  public async postFaucetNative(requestUrl: string, requests: FaucetRequest): Promise<FaucetResponse> {
    if (!this.networkClient) {
      return {
        success: false,
        message: FAUCET_RESPONSE_MESSAGE.ERROR.NETWORK_CLIENT,
      };
    }

    const faucetNativeRequest: FaucetNativeRequest = {
      to: requests.to,
      amount: requests.amount,
    };

    try {
      const response: AxiosResponse<FaucetNativeResponse> = await this.networkClient.post(
        requestUrl,
        faucetNativeRequest,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return this.handleFaucetNativeResponse(response);
    } catch (error) {
      return this.handleFaucetError(error);
    }
  }

  private handleFaucetGRC20Response(response: AxiosResponse<FaucetGRC20Response>): FaucetResponse {
    const data = response?.data;

    if (this.isJsonRpcSuccessResponse(data)) {
      return {
        success: true,
        message: FAUCET_RESPONSE_MESSAGE.SUCCESS.DEFAULT,
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

  private handleFaucetNativeResponse(response: AxiosResponse<FaucetNativeResponse>): FaucetResponse {
    const data = response?.data;

    if (this.isNativeSuccessResponse(data)) {
      return {
        success: true,
        message: FAUCET_RESPONSE_MESSAGE.SUCCESS.DEFAULT,
      };
    }

    if (this.isNativeErrorResponse(data)) {
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

  private isJsonRpcSuccessResponse(data: unknown): data is FaucetGRC20SuccessResponse {
    return typeof data === "object" && data !== null && "jsonrpc" in data && "result" in data;
  }

  private isJsonRpcErrorResponse(data: unknown): data is FaucetGRC20ErrorResponse {
    return typeof data === "object" && data !== null && "error" in data;
  }

  private isNativeSuccessResponse(data: unknown): data is FaucetNativeSuccessResponse {
    return typeof data === "object" && data !== null && "result" in data && typeof data.result === "string";
  }

  private isNativeErrorResponse(data: unknown): data is FaucetNativeErrorResponse {
    return typeof data === "string";
  }
}
