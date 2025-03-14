import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { CommonState, EarnState, LaunchpadState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/data/use-token-data";
import useRouter from "@hooks/common/use-custom-router";
import useScrollData from "./use-scroll-data";
import { useLoading } from "./use-loading";
import { useSocialWalletContext } from "./use-social-wallet-context";
import { GNOSWAP_SOCIAL_LOGIN_TYPE_KEY, GNOSWAP_WALLET_TYPE_KEY } from "@states/common";
import { useAutoDisconnect } from "./use-auto-disconnect";

export const useBackground = () => {
  const router = useRouter();
  const { account, initSession, connectAccount: connectAdenaAccount, updateWalletEvents } = useWallet();
  const { connect: connectSocialAccount, connectingState } = useSocialWalletContext();
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

  /**
   *
   * Purpose:
   * Maintains wallet connection even after browser refresh
   * Only runs when there's no active wallet connection
   *
   * Initializes wallet by checking session storage and retrying if necessary
   *
   * This useEffect handles wallet initialization by checking saved wallet type in session
   * and attempts to initialize appropriate wallet with retry mechanism.
   *
   * @dependency walletClient - Stops initialization if wallet client exists
   * @dependency sessionId - Required for initialization check
   * @dependency initSession - Callback to initialize wallet session
   */
  useEffect(() => {
    if (walletClient) return;

    const MAX_RETRY = 1;
    const RETRY_INTERVAL = 1000;

    const initWalletBySession = async () => {
      const savedWalletType = sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY);
      const savedSocialLoginType = sessionStorage.getItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);

      const shouldInitSocialWallet = savedWalletType === "SOCIAL_WALLET" && savedSocialLoginType;
      const shouldInitAdenaWallet = savedWalletType === "ADENA" && window?.adena?.version;

      if (shouldInitSocialWallet || shouldInitAdenaWallet) {
        initSession();
      }
    };

    const retryInterval = setInterval(() => {
      initWalletBySession();

      const shouldClearInterval = count >= MAX_RETRY || walletClient || !sessionId;
      if (shouldClearInterval) {
        clearInterval(retryInterval);
      }
      count++;
    }, RETRY_INTERVAL);

    let count = 0;

    return () => clearInterval(retryInterval);
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
    if (!walletClient) return;

    const handleWalletConnection = async () => {
      const walletType = walletClient.getWalletType();

      if (walletType === "ADENA") {
        await connectAdenaAccount();
      }

      if (walletType === "SOCIAL_WALLET") {
        const socialLoginType = walletClient.getLoginType?.();
        if (socialLoginType && connectingState !== "error" && connectingState !== "done") {
          await connectSocialAccount(socialLoginType);
        }
      }
    };

    handleWalletConnection();
    updateWalletEvents(walletClient);
  }, [walletClient]);

  /**
   *
   * Automatically disconnects SOCIAL-WALLET after a period of inacitivity
   *
   * Purpose:
   * Implements an auto-disconnect feature for enhanced security of social wallet users
   * Tracks user activity and disconnects the wallet after a period of inactivity
   *
   * Behavior:
   * Only activates for SOCIAL-WALLET type and when account exists
   * Monitors user activities: mouse movements, keystrokes, scrolling, touches, clicks
   * Resets timer on any user activity
   * Disconnects wallet after 5 minutes of inactivity
   *
   */
  useAutoDisconnect();

  useEffect(() => {
    if (account?.address && account?.chainId) {
      refetchGrc20Balances();
      updateBalances();
    }
  }, [account]);
};
