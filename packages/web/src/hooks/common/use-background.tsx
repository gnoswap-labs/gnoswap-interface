import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { CommonState, EarnState, LaunchpadState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/data/use-token-data";
import useRouter from "@hooks/common/use-custom-router";
import useScrollData from "./use-scroll-data";
import { useLoading } from "./use-loading";
import { useSocialWalletContext } from "./use-social-wallet-context";

export const useBackground = () => {
  const router = useRouter();
  const { account, initSession, connectAccount: connectAdenaAccount, updateWalletEvents } = useWallet();
  const { connect: connectSocialAccount } = useSocialWalletContext();
  const [walletClient] = useAtom(WalletState.client);
  const [sessionId] = useAtom(CommonState.sessionId);
  const [isViewMorePositions, setIsViewMorePositions] = useAtom(EarnState.isViewMorePositions);
  const [isViewMoreActiveProjects, setIsViewMoreActiveProjects] = useAtom(LaunchpadState.isViewMoreActiveProjects);
  const { updateBalances, refetchGrc20Balances } = useTokenData();
  const { scrollTo, getScrollHeight } = useScrollData();
  const { isLoadingTokens, isLoadingPools, isLoadingLaunchpadProjectList } = useLoading();
  const [memorizedPath, setMemorizedPath] = useState<string | null>(null);

  useEffect(() => {
    if (memorizedPath === null) {
      return;
    }
    if (isLoadingPools || isLoadingTokens) {
      if (["/launchpad"].includes(router.pathname)) {
        switch (router.pathname) {
          case "/launchpad":
            scrollTo(getScrollHeight(router.pathname));
            setMemorizedPath(null);
            break;
        }
      }

      return;
    }
    if (["/", "/earn"].includes(router.pathname)) {
      switch (router.pathname) {
        case "/":
          scrollTo(getScrollHeight(router.pathname));
          setMemorizedPath(null);
          break;
        case "/earn":
          scrollTo(getScrollHeight(router.pathname));
          setMemorizedPath(null);
          break;
        case "/earn/[pool-path]":
          scrollTo(getScrollHeight(router.pathname));
          setMemorizedPath(null);
          break;
        default:
          break;
      }
    }
  }, [isLoadingPools, isLoadingTokens, isLoadingLaunchpadProjectList, memorizedPath, router.pathname]);

  useEffect(() => {
    if (!router.pathname.startsWith("/earn") && isViewMorePositions) {
      setIsViewMorePositions(false);
    }
    if (!router.pathname.startsWith("/launchpad") && isViewMoreActiveProjects) {
      setIsViewMoreActiveProjects(false);
    }
  }, [router.pathname]);

  const onPopPage = (): void => {
    if (["/earn/add", "/earn/pool", "/token", "/launchpad/project"].includes(router.pathname)) {
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

  /**
   *
   * Run when the wallet client changes or the account changes
   * Perform appropriate connection handling based on wallet type
   * Update wallet event listeners
   *
   * @dependency walletClient?.getWalletType() - When the wallet type changes
   * @dependency String(account) - When the account changes
   *
   */
  useEffect(() => {
    if (!walletClient || !account) return;

    const handleWalletConnection = async () => {
      const walletType = walletClient.getWalletType();

      if (walletType === "ADENA") {
        await connectAdenaAccount();
      }

      if (walletType === "SOCIAL_WALLET") {
        const socialLoginType = walletClient.getLoginType?.();
        if (socialLoginType) {
          await connectSocialAccount(socialLoginType);
        }
      }
    };

    handleWalletConnection();
    updateWalletEvents(walletClient);
  }, [walletClient?.getWalletType(), String(account)]);

  useEffect(() => {
    if (account?.address && account?.chainId) {
      refetchGrc20Balances();
      updateBalances();
    }
  }, [account]);
};
