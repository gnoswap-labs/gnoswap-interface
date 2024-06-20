import { useWallet } from "@hooks/wallet/use-wallet";
import * as CommonState from "@states/common";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";


export const useUncommonToken = () => {
  const { account, connected } = useWallet();

  const { localStorageClient } = useGnoswapContext();

  const storageKeyForCurrentUser = useMemo(() => `${account?.address}_UNCOMMON_TOKEN`, [account?.address]);

  const [warningStatus, setWarningStatus] = useAtom(CommonState.unCommonTokenWarningStatus);

  const addToken = useCallback((path: string) => {
    const tokenPaths = new Set([...warningStatus, path]);

    setWarningStatus([...tokenPaths]);
    localStorageClient.set(storageKeyForCurrentUser, JSON.stringify([...tokenPaths]));
  }, [localStorageClient, setWarningStatus, storageKeyForCurrentUser, warningStatus]);

  useEffect(() => {
    if (!account || !connected) {
      setWarningStatus([]);
    }

    try {
      const storageDataStr = localStorageClient.get(storageKeyForCurrentUser) ?? "[]";
      const data = JSON.parse(storageDataStr);

      setWarningStatus(data);
    } catch (error) {
      setWarningStatus([]);
    }
  }, [storageKeyForCurrentUser, localStorageClient, setWarningStatus, account, connected]);


  return {
    warningStatus,
    addToken,
  };
};