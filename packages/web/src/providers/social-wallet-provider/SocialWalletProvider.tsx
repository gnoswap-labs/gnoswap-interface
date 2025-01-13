import React, { useCallback } from "react";

import { SocialWalletLoginType } from "./types";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { SocialWalletClient } from "@common/clients/wallet-client/social/social-wallet-client";
import { ACCOUNT_SESSION_INFO_KEY, GNOSWAP_SOCIAL_LOGIN_TYPE_KEY, GNOSWAP_WALLET_TYPE_KEY } from "@states/common";
import { SocialLoginType } from "src/types/wallet.types";

interface SocialWalletContextType {
  connectingState: "initial" | "loading" | "error" | "done" | "";
  connect: (type: SocialWalletLoginType) => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  connectSocialWalletClient: (loginType: SocialLoginType) => Promise<void>;
}

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

  const resetWalletState = () => {
    setWalletClient(null);
    setWalletAccount(null);
    accountRepository.setConnectedWallet(false);

    sessionStorage.removeItem(GNOSWAP_WALLET_TYPE_KEY);
    sessionStorage.removeItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);
    sessionStorage.removeItem(ACCOUNT_SESSION_INFO_KEY);
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
    try {
      setConnectingState("loading");
      setError(null);

      const socialWalletClient = await SocialWalletClient.createSocialWalletClient(loginType);
      if (!socialWalletClient) {
        throw new Error("Failed to create socail wallet client");
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
        // const availNetwork = SUPPORT_CHAIN_IDS.includes(account.chainId);
        // if (!availNetwork) {
        //   await accountRepository.switchNetwork(SUPPORT_CHAIN_IDS[0]);
        // }
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
        setConnectingState("done");
        resetConnectingState();
      } else {
        accountRepository.setConnectedWallet(false);
        setConnectingState("error");
        resetConnectingState();
      }
    } catch (err) {
      resetWalletState();
      setConnectingState("error");
      setError(err instanceof Error ? err.message : "Failed to connect Social Wallet");
    }
  };

  const disconnect = async () => {
    try {
      if (walletClient) {
        await walletClient.disconnect();
        resetWalletState();
      }
    } catch {}
  };

  return (
    <SocialWalletContext.Provider value={{ connect, connectSocialWalletClient, connectingState, disconnect, error }}>
      {children}
    </SocialWalletContext.Provider>
  );
};
