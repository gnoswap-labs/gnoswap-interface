import { useEffect, useRef } from "react";

import { WalletClient } from "@common/clients/wallet-client";
import { AccountModel } from "@models/account/account-model";

import { hasWalletAccountChanged } from "./use-wallet.util";

/**
 * Adena only dispatches `changedAccount` / `changedNetwork` to the active tab,
 * so a background tab misses changes made elsewhere. Re-read the account when
 * the tab becomes visible again and resync if it no longer matches.
 */
export const useAdenaAccountResync = (
  walletClient: WalletClient | null,
  account: AccountModel | null,
  onAccountChanged: () => void,
) => {
  const walletClientRef = useRef(walletClient);
  const accountRef = useRef(account);
  const onAccountChangedRef = useRef(onAccountChanged);
  walletClientRef.current = walletClient;
  accountRef.current = account;
  onAccountChangedRef.current = onAccountChanged;

  useEffect(() => {
    if (!walletClient || walletClient.getWalletType() !== "ADENA") {
      return;
    }

    let disposed = false;
    let checking = false;
    let recheckPending = false;

    // A lookup only applies while its wallet client and account are still the active ones.
    const isOriginActive = (origin: AccountModel) => {
      const current = accountRef.current;
      return (
        !disposed &&
        walletClientRef.current === walletClient &&
        current !== null &&
        current.address === origin.address &&
        current.chainId === origin.chainId
      );
    };

    const checkAccount = async () => {
      const origin = accountRef.current;
      if (disposed || document.visibilityState !== "visible" || !origin) {
        return;
      }
      if (checking) {
        recheckPending = true;
        return;
      }

      checking = true;
      let resynced = false;
      try {
        const response = await walletClient.getAccount();
        if (isOriginActive(origin) && hasWalletAccountChanged(origin, response)) {
          resynced = true;
          onAccountChangedRef.current();
        }
      } catch {
        // A failed lookup leaves the current state as is.
      } finally {
        checking = false;
      }

      // The resync reads the account again, so a queued recheck is only needed otherwise.
      const shouldRecheck = recheckPending && !resynced;
      recheckPending = false;
      if (shouldRecheck) {
        void checkAccount();
      }
    };

    document.addEventListener("visibilitychange", checkAccount);
    window.addEventListener("focus", checkAccount);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", checkAccount);
      window.removeEventListener("focus", checkAccount);
    };
  }, [walletClient]);
};
