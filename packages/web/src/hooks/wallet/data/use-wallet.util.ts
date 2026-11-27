import { AccountInfo, WalletResponse } from "@common/clients/wallet-client/protocols";
import { AdenaError, ERROR_VALUE } from "@common/errors/adena";

export const isWalletLockedResponse = (response: Pick<WalletResponse, "code" | "type"> | null) => {
  return response?.code === ERROR_VALUE.WALLET_LOCKED.status && response.type === ERROR_VALUE.WALLET_LOCKED.type;
};

export const isWalletLockedError = (error: unknown) => {
  return error instanceof AdenaError && error.getType() === ERROR_VALUE.WALLET_LOCKED.type;
};

type WalletAccountIdentity = Pick<AccountInfo, "address" | "chainId">;

/**
 * Returns true when the wallet reports a different address or chain than the one the app holds.
 * Failed responses (e.g. a locked wallet) are not treated as a change.
 */
export const hasWalletAccountChanged = (
  account: WalletAccountIdentity | null,
  response: Pick<WalletResponse<WalletAccountIdentity>, "status" | "data"> | null,
) => {
  if (!account || response?.status !== "success" || !response.data) {
    return false;
  }
  return response.data.address !== account.address || response.data.chainId !== account.chainId;
};
