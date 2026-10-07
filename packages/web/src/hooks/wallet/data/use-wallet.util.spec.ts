import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { AdenaError, ERROR_VALUE } from "@common/errors/adena";
import { isWalletLockedError, isWalletLockedResponse } from "./use-wallet.util";

describe("wallet login response helpers", () => {
  it("detects locked Adena responses before establish requests", () => {
    const response: WalletResponse<null> = {
      code: ERROR_VALUE.WALLET_LOCKED.status,
      status: "failure",
      type: ERROR_VALUE.WALLET_LOCKED.type,
      message: "Adena is locked.",
      data: null,
    };

    expect(isWalletLockedResponse(response)).toBe(true);
  });

  it("does not treat other wallet failures as locked responses", () => {
    const response: WalletResponse<null> = {
      code: ERROR_VALUE.NOT_CONNECTED.status,
      status: "failure",
      type: ERROR_VALUE.NOT_CONNECTED.type,
      message: "A connection has not been established.",
      data: null,
    };

    expect(isWalletLockedResponse(response)).toBe(false);
  });

  it("detects locked Adena errors from validated account responses", () => {
    expect(isWalletLockedError(new AdenaError("WALLET_LOCKED"))).toBe(true);
  });
});
