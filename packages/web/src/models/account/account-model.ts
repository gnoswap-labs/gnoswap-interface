import { AmountModel } from "@models/common/amount-model";

export interface AccountModel {
  status: "ACTIVE" | "IN_ACTIVE" | "NONE";
  address: string;
  balances: AmountModel[];
  publicKeyType: string;
  publicKeyValue: string;
  accountNumber: number;
  sequence: number;
  chainId: string;
}
