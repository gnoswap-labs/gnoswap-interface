import { act, renderHook } from "@testing-library/react";

import { WalletClient } from "@common/clients/wallet-client";
import { AccountModel } from "@models/account/account-model";

import { useAdenaAccountResync } from "./use-adena-account-resync";

const account = { address: "g1current", chainId: "dev.gnoswap" } as AccountModel;

const createWalletClient = (walletType: string, data: { address: string; chainId: string } | null) =>
  ({
    getWalletType: () => walletType,
    getAccount: jest.fn().mockResolvedValue({ status: data ? "success" : "failure", data }),
  }) as unknown as WalletClient & { getAccount: jest.Mock };

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
};

type AccountData = { address: string; chainId: string };

const createDeferredWalletClient = () => {
  const pending: Array<(data: AccountData) => void> = [];
  const getAccount = jest.fn(
    () =>
      new Promise(resolve => {
        pending.push(data => resolve({ status: "success", data }));
      }),
  );
  const walletClient = { getWalletType: () => "ADENA", getAccount } as unknown as WalletClient & {
    getAccount: jest.Mock;
  };
  const resolveNext = async (data: AccountData) => {
    await act(async () => {
      pending.shift()?.(data);
    });
  };
  return { walletClient, resolveNext };
};

const fireVisible = async () => {
  setVisibility("visible");
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
};

describe("useAdenaAccountResync", () => {
  afterEach(() => setVisibility("visible"));

  it("resyncs when the tab becomes visible with a different Adena account", async () => {
    const walletClient = createWalletClient("ADENA", { address: "g1other", chainId: "dev.gnoswap" });
    const onAccountChanged = jest.fn();
    renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await fireVisible();

    expect(walletClient.getAccount).toHaveBeenCalledTimes(1);
    expect(onAccountChanged).toHaveBeenCalledTimes(1);
  });

  it("resyncs on window focus when the Adena network changed", async () => {
    const walletClient = createWalletClient("ADENA", { address: "g1current", chainId: "gnoland1" });
    const onAccountChanged = jest.fn();
    renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });

    expect(onAccountChanged).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the Adena account is unchanged", async () => {
    const walletClient = createWalletClient("ADENA", { address: "g1current", chainId: "dev.gnoswap" });
    const onAccountChanged = jest.fn();
    renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await fireVisible();

    expect(walletClient.getAccount).toHaveBeenCalledTimes(1);
    expect(onAccountChanged).not.toHaveBeenCalled();
  });

  it("does not query the wallet while the tab is hidden", async () => {
    const walletClient = createWalletClient("ADENA", { address: "g1other", chainId: "dev.gnoswap" });
    renderHook(() => useAdenaAccountResync(walletClient, account, jest.fn()));

    setVisibility("hidden");
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(walletClient.getAccount).not.toHaveBeenCalled();
  });

  it("ignores non-Adena wallets and disconnected sessions", async () => {
    const socialClient = createWalletClient("SOCIAL_WALLET", { address: "g1other", chainId: "dev.gnoswap" });
    const adenaClient = createWalletClient("ADENA", { address: "g1other", chainId: "dev.gnoswap" });
    renderHook(() => useAdenaAccountResync(socialClient, account, jest.fn()));
    renderHook(() => useAdenaAccountResync(adenaClient, null, jest.fn()));

    await fireVisible();

    expect(socialClient.getAccount).not.toHaveBeenCalled();
    expect(adenaClient.getAccount).not.toHaveBeenCalled();
  });

  it("discards a pending lookup after the effect is cleaned up", async () => {
    const { walletClient, resolveNext } = createDeferredWalletClient();
    const onAccountChanged = jest.fn();
    const { unmount } = renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await fireVisible();
    unmount();
    await resolveNext({ address: "g1other", chainId: "dev.gnoswap" });

    expect(onAccountChanged).not.toHaveBeenCalled();
  });

  it("discards a pending lookup after the wallet session switches to another client", async () => {
    const { walletClient, resolveNext } = createDeferredWalletClient();
    const socialClient = createWalletClient("SOCIAL_WALLET", null);
    const socialAccount = { address: "g1social", chainId: "dev.gnoswap" } as AccountModel;
    const onAccountChanged = jest.fn();
    const { rerender } = renderHook(({ client, current }) => useAdenaAccountResync(client, current, onAccountChanged), {
      initialProps: { client: walletClient as WalletClient | null, current: account as AccountModel | null },
    });

    await fireVisible();
    rerender({ client: null, current: null });
    rerender({ client: socialClient, current: socialAccount });
    await resolveNext({ address: "g1other", chainId: "dev.gnoswap" });

    expect(onAccountChanged).not.toHaveBeenCalled();
  });

  it("rechecks when the tab returns while a lookup is still pending", async () => {
    const { walletClient, resolveNext } = createDeferredWalletClient();
    const onAccountChanged = jest.fn();
    renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await fireVisible();
    setVisibility("hidden");
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await fireVisible();
    expect(walletClient.getAccount).toHaveBeenCalledTimes(1);

    await resolveNext({ address: "g1current", chainId: "dev.gnoswap" });
    expect(walletClient.getAccount).toHaveBeenCalledTimes(2);
    expect(onAccountChanged).not.toHaveBeenCalled();

    await resolveNext({ address: "g1other", chainId: "dev.gnoswap" });
    expect(walletClient.getAccount).toHaveBeenCalledTimes(2);
    expect(onAccountChanged).toHaveBeenCalledTimes(1);
  });

  it("skips the queued recheck once a resync has been triggered", async () => {
    const { walletClient, resolveNext } = createDeferredWalletClient();
    const onAccountChanged = jest.fn();
    renderHook(() => useAdenaAccountResync(walletClient, account, onAccountChanged));

    await fireVisible();
    await fireVisible();
    await resolveNext({ address: "g1other", chainId: "dev.gnoswap" });

    expect(walletClient.getAccount).toHaveBeenCalledTimes(1);
    expect(onAccountChanged).toHaveBeenCalledTimes(1);
  });

  it("removes listeners on unmount", async () => {
    const walletClient = createWalletClient("ADENA", { address: "g1other", chainId: "dev.gnoswap" });
    const { unmount } = renderHook(() => useAdenaAccountResync(walletClient, account, jest.fn()));
    unmount();

    await fireVisible();

    expect(walletClient.getAccount).not.toHaveBeenCalled();
  });
});
