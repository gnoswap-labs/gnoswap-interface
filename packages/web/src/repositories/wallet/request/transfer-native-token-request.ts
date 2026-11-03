import { TokenModel } from "@models/token/token-model";

export interface TransferNativeTokenRequest {
  token: TokenModel;

  // only integer
  tokenAmount: string;

  fromAddress: string;

  toAddress: string;

  gasFee?: string;

  gasUsed?: string;
}

/** A native transfer request without the gas figures, which only the send path needs. */
export type TransferNativeTokenMessagesRequest = Omit<TransferNativeTokenRequest, "gasFee" | "gasUsed">;
