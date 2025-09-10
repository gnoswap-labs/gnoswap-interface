import { AxiosError, AxiosInstance } from "axios";

import { FaucetRepository } from "./faucet-repository";
import { FaucetRequest } from "./request";
import { FaucetResponse } from "./response";
import { makeRandomId } from "@utils/common";

import FaucetEndPoints from "./resources/faucet-api.json";

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

  public async postFaucet(requestUrl: string, requests: FaucetRequest): Promise<FaucetResponse> {
    if (!this.networkClient) {
      return {
        success: false,
        message: "NetworkClient is not available",
      };
    }

    return this.networkClient
      .post(requestUrl, {
        to: requests.to,
        amount: requests.amount,
      })
      .then(response => {
        if (response?.data?.result) {
          return {
            success: true,
            message: "Tokens successfully received!",
          };
        }
        return {
          success: false,
          message: "Unexpected Error.",
        };
      })
      .catch(e => {
        const success = false;
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            return {
              success,
              message: e.response?.data,
            };
          }
        }
        return {
          success,
          message: "Unexpected Error.",
        };
      });
  }

  public async postFaucetGRC20(requestUrl: string, requests: FaucetRequest): Promise<FaucetResponse> {
    if (!this.networkClient) {
      return {
        success: false,
        message: "NetworkClient is not available",
      };
    }

    const jsonRpcRequest = {
      jsonrpc: "2.0",
      id: makeRandomId(),
      method: "drip",
      params: [requests.to, requests.amount.toString()],
    };

    return this.networkClient
      .post(requestUrl, jsonRpcRequest, {
        headers: { "Content-Type": "application/json" },
      })
      .then(response => {
        if (response?.data?.result) {
          return {
            success: true,
            message: "Tokens successfully received!",
          };
        }
        return {
          success: false,
          message: "Unexpected Error.",
        };
      })
      .catch(e => {
        const success = false;
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            return {
              success,
              message: e.response.data,
            };
          }
        }
        return {
          success,
          message: "Unexpected Error.",
        };
      });
  }
}
