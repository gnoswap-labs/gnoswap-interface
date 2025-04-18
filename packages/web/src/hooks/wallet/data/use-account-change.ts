import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { AccountModel } from "@models/account/account-model";

interface AccountChangeOptions {
  /**
   * A callback function to run on account changes
   */
  onAccountChange?: (prevAccount: AccountModel | null, currentAccount: AccountModel | null) => void;
}

/**
 * Hooks to detect account changes
 *
 * Only switching to a different account while already connected will be detected as an account change.
 */
export const useAccountChange = (options: AccountChangeOptions = {}) => {
  const { account } = useWallet();
  const prevAccountRef = React.useRef<AccountModel | null>(null);
  const [hasAccountChanged, setHasAccountChanged] = React.useState(false);
  const { onAccountChange } = options;

  // Detect account changes
  React.useEffect(() => {
    const prevAccount = prevAccountRef.current;

    // Check if the account has changed
    if (prevAccount !== null && account !== null && prevAccount.address !== account.address) {
      setHasAccountChanged(true);

      // Execute callback function if provided
      if (onAccountChange) {
        onAccountChange(prevAccount, account);
      }
    }

    // Save current account as old account
    prevAccountRef.current = account;
  }, [account, onAccountChange]);

  const isNewConnection = React.useMemo(() => {
    return prevAccountRef.current === null && account !== null;
  }, [account]);

  const isDisconnected = React.useMemo(() => {
    return prevAccountRef.current !== null && account === null;
  }, [account]);

  return {
    hasAccountChanged,

    isNewConnection,

    isDisconnected,

    currentAccount: account,

    previousAccount: prevAccountRef.current,

    resetChangeDetection: () => setHasAccountChanged(false),
  };
};
