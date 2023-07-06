import { AmountType } from "@common/types/data-prop-types";

export interface TokenDefaultModel {
  tokenId: string;
  name: string;
  symbol: string;
  amount?: AmountType;
  tokenLogo: string;
}
