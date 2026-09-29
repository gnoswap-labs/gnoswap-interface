import { TokenModel } from "@models/token/token-model";

export interface WrapTokenRequest {
  token: TokenModel;

  tokenAmount: string;

  gasFee?: string;

  gasUsed?: string;
}

/** A wrap request without the gas figures, which only the send path needs. */
export type WrapTokenMessagesRequest = Omit<WrapTokenRequest, "gasFee" | "gasUsed">;
