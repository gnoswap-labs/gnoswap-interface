import { SendTransactionResponse, WalletResponse } from "../protocols";
import {
  AdenaSendTransactionResponse,
  AdenaSendTransactionSuccessResponse,
} from "./adena";
import {} from "@utils/rpc-utils";

function matchValues(str: string): string[] {
  const regexp = /\((.*)\)/g;
  const result = str.match(regexp);
  if (result === null || result.length < 1) {
    return [];
  }
  return result;
}

function parseABCIValue(str: string): string {
  const regexp = /\s.*$/;
  return str.replace(regexp, "").slice(1);
}

export function isTransactionSuccessResponse(
  walletResponse: WalletResponse<AdenaSendTransactionResponse>,
): walletResponse is WalletResponse<AdenaSendTransactionSuccessResponse> {
  return walletResponse.status === "success";
}

export function parseTransactionResponse(
  walletResponse: WalletResponse<AdenaSendTransactionResponse>,
): WalletResponse<SendTransactionResponse<string[] | null>> {
  if (!isTransactionSuccessResponse(walletResponse)) {
    return {
      ...walletResponse,
      data: {
        hash: walletResponse.data?.hash || "",
        height: "",
        data: null,
      },
    } as WalletResponse<SendTransactionResponse<string[] | null>>;
  }

  let data: string | string[] | null = null;
  const encodedData = walletResponse.data?.deliver_tx.ResponseBase.Data || null;
  if (encodedData) {
    const decodedData = window.atob(encodedData);
    try {
      const result = matchValues(decodedData);
      if (result.length === 0) {
        data = null;
      } else {
        data = result.map(parseABCIValue);
      }
    } catch {
      data = null;
    }
  }
  return {
    code: walletResponse.code,
    status: walletResponse.status,
    type: walletResponse.type,
    message: walletResponse.message,
    data: {
      hash: walletResponse.data?.hash || "",
      height: walletResponse.data?.height || "",
      // eslint-disable-next-line quotes
      data: data?.map(s => s.replaceAll('"', "")),
    },
  } as WalletResponse<SendTransactionResponse<string[] | null>>;
}
