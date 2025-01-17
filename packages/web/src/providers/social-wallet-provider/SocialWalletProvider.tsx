import React, { useCallback } from "react";

import { SocialWalletLoginType } from "./types";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { SocialWalletClient } from "@common/clients/wallet-client/social/social-wallet-client";
import {
  ACCOUNT_SESSION_INFO_KEY,
  GNOSWAP_SOCIAL_LOGIN_TYPE_KEY,
  GNOSWAP_WALLET_TYPE_KEY,
  SOCIAL_WALLET_MODAL_SHOWN_IN_SESSION,
} from "@states/common";
import { SocialLoginType } from "src/types/wallet.types";
import { useConnectedSocialWalletModal } from "@hooks/wallet/ui/use-connected-social-wallet-modal";
import { useConnectWalletErrorModal } from "@hooks/wallet/ui/use-connect-wallet-error-modal";

interface SocialWalletContextType {
  connectingState: "initial" | "loading" | "error" | "done" | "";
  connect: (type: SocialWalletLoginType) => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  connectSocialWalletClient: (loginType: SocialLoginType) => Promise<void>;
}

const CONNECT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const SocialWalletContext = React.createContext<SocialWalletContextType | null>(null);

export const SocialWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { accountRepository } = useGnoswapContext();
  const [connectingState, setConnectingState] = React.useState<"initial" | "loading" | "error" | "done" | "">(
    "initial",
  );
  const [sessionId] = useAtom(CommonState.sessionId);
  const [error, setError] = React.useState<string | null>(null);
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [, setWalletAccount] = useAtom(WalletState.account);

  const { openModal: openConnectedModal } = useConnectedSocialWalletModal();
  const { openModal: openConnectErrorModal } = useConnectWalletErrorModal();

  const resetSocialWalletState = () => {
    setWalletClient(null);
    setWalletAccount(null);
    accountRepository.setConnectedWallet(false);

    sessionStorage.removeItem(GNOSWAP_WALLET_TYPE_KEY);
    sessionStorage.removeItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);
    sessionStorage.removeItem(ACCOUNT_SESSION_INFO_KEY);
    sessionStorage.removeItem(SOCIAL_WALLET_MODAL_SHOWN_IN_SESSION);
  };

  const resetConnectingState = (delay = 1000) => {
    setTimeout(() => {
      setConnectingState("initial");
    }, delay);
  };

  const connectSocialWalletClient = useCallback(
    async (loginType: SocialLoginType) => {
      if (connectingState !== "initial") {
        setConnectingState("loading");
      }
      const socialWallet = await SocialWalletClient.createSocialWalletClient(loginType);
      if (socialWallet !== null) {
        sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "SOCIAL_WALLET");
        sessionStorage.setItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY, loginType);
        socialWallet.initSocialWallet(loginType);
      }
      setWalletClient(socialWallet);
    },
    [sessionId, connectingState],
  );

  const connect = async (loginType: SocialWalletLoginType) => {
    const connectProcess = async () => {
      try {
        setConnectingState("loading");
        setError(null);

        const socialWalletClient = await SocialWalletClient.createSocialWalletClient(loginType);
        if (!socialWalletClient) {
          throw new Error("Failed to create social wallet client");
        }

        sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "SOCIAL_WALLET");
        sessionStorage.setItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY, loginType);
        setWalletClient(socialWalletClient);
        accountRepository.setWalletClient(socialWalletClient);

        const established = await accountRepository.addEstablishedSite().catch(() => null);
        if (!established || established.code === 4000) {
          throw new Error("Failed to established site");
        }

        if (established.code === 0 || established.code === 4001) {
          const account = await accountRepository.getAccount();
          if (!account) {
            throw new Error("Failed to get account");
          }

          sessionStorage.setItem(ACCOUNT_SESSION_INFO_KEY, JSON.stringify(account));
          setWalletAccount(account);
          accountRepository.setConnectedWallet(true);
          setConnectingState("done");

          openConnectedModal();

          resetConnectingState();
        } else {
          accountRepository.setConnectedWallet(false);
          setConnectingState("error");
          openConnectErrorModal();
          resetConnectingState();
        }
      } catch (err) {
        resetSocialWalletState();
        setConnectingState("error");
        openConnectErrorModal();
        setError(err instanceof Error ? err.message : "Failed to connect Social Wallet");
      }
    };

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Connection timeout after 5 minutes"));
        openConnectErrorModal();
      }, CONNECT_TIMEOUT_MS);
    });

    try {
      await Promise.race([connectProcess(), timeoutPromise]);
    } catch (err) {
      resetSocialWalletState();
      setConnectingState("error");
      openConnectErrorModal();
      setError(err instanceof Error ? err.message : "Connection timeout");
    }
  };

  const disconnect = async () => {
    try {
      if (walletClient) {
        await walletClient.disconnect();
        resetSocialWalletState();
      }
    } catch {}
  };

  return (
    <SocialWalletContext.Provider value={{ connect, connectSocialWalletClient, connectingState, disconnect, error }}>
      {children}
    </SocialWalletContext.Provider>
  );
};
