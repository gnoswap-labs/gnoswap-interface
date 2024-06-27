import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";

export type UpDownType = "up" | "down" | "none";

export interface CardListTokenInfo {
  token: TokenModel;
  upDown: UpDownType;
  content: string;
}

export interface CardListPoolInfo {
  pool: PoolModel;
  upDown: UpDownType;
  apr: string;
}

export interface CardListKeyStats {
  label: string;
  content: string;
}
