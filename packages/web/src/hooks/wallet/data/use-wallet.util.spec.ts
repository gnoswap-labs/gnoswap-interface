import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { AdenaError, ERROR_VALUE } from "@common/errors/adena";
import { hasWalletAccountChanged, isWalletLockedError, isWalletLockedResponse } from "./use-wallet.util";

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

describe("hasWalletAccountChanged", () => {
  const account = { address: "g1current", chainId: "dev.gnoswap" };
  const success = (data: { address: string; chainId: string }) => ({ status: "success", data });

  it("returns false when the wallet reports the same account", () => {
    expect(hasWalletAccountChanged(account, success(account))).toBe(false);
  });

  it("detects a different address", () => {
    expect(hasWalletAccountChanged(account, success({ ...account, address: "g1other" }))).toBe(true);
  });

  it("detects a different chain", () => {
    expect(hasWalletAccountChanged(account, success({ ...account, chainId: "gnoland1" }))).toBe(true);
  });

  it("ignores failed responses and a missing app account", () => {
    expect(hasWalletAccountChanged(account, { status: "failure", data: null })).toBe(false);
    expect(hasWalletAccountChanged(null, success({ ...account, address: "g1other" }))).toBe(false);
  });
});
