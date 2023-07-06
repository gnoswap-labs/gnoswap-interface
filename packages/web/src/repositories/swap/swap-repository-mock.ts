import { StorageClient } from "@common/clients/storage-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { generateNumber, generateTxHash } from "@common/utils/test-util";
import {
  SwapExpectedResultResponse,
  SwapFeeResponse,
  SwapRateResponse,
  SwapRepository,
  SwapResponse,
} from ".";

export class SwapRepositoryMock implements SwapRepository {
  private localStorageClient: StorageClient;

  constructor() {
    this.localStorageClient = new MockStorageClient("LOCAL");
  }

  public getSwapRate = async (): Promise<SwapRateResponse> => {
    return {
      rate: generateNumber(0, 100),
    };
  };

  public getSwapFee = async (): Promise<SwapFeeResponse> => {
    return {
      fee: generateNumber(0, 1),
    };
  };

  public getExpectedSwapResult = async (): Promise<
    SwapExpectedResultResponse
  > => {
    return {
      price_impact: generateNumber(0, 10000),
      min_received: generateNumber(0, 10000),
      gas_fee: generateNumber(0, 1),
    };
  };

  public getSlippage = (): number => {
    const slippageValue = this.localStorageClient.get("slippage");
    try {
      return parseFloat(slippageValue ?? "0");
    } catch (e) {
      console.error(e);
    }
    return 0;
  };

  public setSlippage = (slippage: number): boolean => {
    this.localStorageClient.set("slippage", `${slippage}`);
    return true;
  };

  public swap = async (): Promise<SwapResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };
}
