import { AxiosError, AxiosInstance } from "axios";

import { FaucetRepository } from "./faucet-repository";
import { FaucetRequest } from "./request";
import { FaucetResponse } from "./response";
import { makeRandomId } from "@utils/common";
import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";

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
        message: FAUCET_RESPONSE_MESSAGE.ERROR.NETWORK_CLIENT,
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
            message: FAUCET_RESPONSE_MESSAGE.SUCCESS.MESSAGE,
          };
        }
        return {
          success: false,
          message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
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
          message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
        };
      });
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
      id: Math.floor(makeRandomId()),
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
            message: FAUCET_RESPONSE_MESSAGE.SUCCESS.MESSAGE,
          };
        }
        return {
          success: false,
          message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
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
          message: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
        };
      });
  }
}
