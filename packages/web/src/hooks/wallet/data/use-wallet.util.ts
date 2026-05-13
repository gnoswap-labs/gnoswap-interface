import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { AdenaError, ERROR_VALUE } from "@common/errors/adena";

export const isWalletLockedResponse = (response: Pick<WalletResponse, "code" | "type"> | null) => {
  return response?.code === ERROR_VALUE.WALLET_LOCKED.status && response.type === ERROR_VALUE.WALLET_LOCKED.type;
};

export const isWalletLockedError = (error: unknown) => {
  return error instanceof AdenaError && error.getType() === ERROR_VALUE.WALLET_LOCKED.type;
};
