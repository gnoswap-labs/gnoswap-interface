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
  const accountRef = useRef(account);
  const onAccountChangedRef = useRef(onAccountChanged);
  accountRef.current = account;
  onAccountChangedRef.current = onAccountChanged;

  useEffect(() => {
    if (!walletClient || walletClient.getWalletType() !== "ADENA") {
      return;
    }

    let checking = false;
    const checkAccount = async () => {
      if (checking || document.visibilityState !== "visible" || !accountRef.current) {
        return;
      }
      checking = true;
      try {
        const response = await walletClient.getAccount();
        if (hasWalletAccountChanged(accountRef.current, response)) {
          onAccountChangedRef.current();
        }
      } catch {
        // A failed lookup leaves the current state as is.
      } finally {
        checking = false;
      }
    };

    document.addEventListener("visibilitychange", checkAccount);
    window.addEventListener("focus", checkAccount);
    return () => {
      document.removeEventListener("visibilitychange", checkAccount);
      window.removeEventListener("focus", checkAccount);
    };
  }, [walletClient]);
};
