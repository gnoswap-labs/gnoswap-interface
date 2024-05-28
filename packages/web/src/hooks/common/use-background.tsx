import { useEffect, useState } from "react";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/use-token-data";
import useRouter from "@hooks/common/use-custom-router";
import useScrollData from "./use-scroll-data";
import { useLoading } from "./use-loading";

export const useBackground = () => {
  const router = useRouter();
  const { account, initSession, updateWalletEvents, connectAccount } =
    useWallet();
  const [walletClient] = useAtom(WalletState.client);
  const [sessionId] = useAtom(CommonState.sessionId);
  const { updateBalances } = useTokenData();
  const { scrollTo, getScrollHeight } = useScrollData();
  const { isLoadingTokens, isLoadingPools, isLoadingPositions } = useLoading();
  const [memorizedPath, setMemorizedPath] = useState<string | null>(null);

  useEffect(() => {
    if (memorizedPath === null) {
      return;
    }
    if (isLoadingPools || isLoadingTokens) {
      return;
    }
    if (["/", "/earn"].includes(router.pathname)) {
      switch (router.pathname) {
        case "/":
          scrollTo(getScrollHeight(router.pathname));
          setMemorizedPath(null);
          break;
        case "/earn":
          if (!isLoadingPositions) {
            scrollTo(getScrollHeight(router.pathname));
            setMemorizedPath(null);
          }
          break;
        default:
          break;
      }
    }
  }, [
    isLoadingPools,
    isLoadingPositions,
    isLoadingTokens,
    memorizedPath,
    router.pathname,
  ]);

  const onPopPage = (): void => {
    if (
      ["/earn/pool/[pool-path]", "/tokens/[token-path]"].includes(
        router.pathname,
      )
    ) {
      setMemorizedPath(router.pathname);
    } else {
      setMemorizedPath(null);
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", onPopPage);
    return () => window.removeEventListener("popstate", onPopPage);
  }, [router.pathname]);

  useEffect(() => {
    if (walletClient) {
      return;
    }
    function initWalletBySession() {
      if (window?.adena?.version) {
        initSession();
      }
    }

    let count = 0;
    const interval = setInterval(() => {
      initWalletBySession();
      count += 1;
      if (count > 5 || walletClient || !sessionId) {
        clearInterval(interval);
      }
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, [walletClient]);

  useEffect(() => {
    if (walletClient) {
      if (account) {
        connectAccount();
      }
      updateWalletEvents(walletClient);
    }
  }, [walletClient, String(account)]);

  useEffect(() => {
    if (account?.address && account?.chainId) {
      updateBalances();
    }
  }, [account]);
};
