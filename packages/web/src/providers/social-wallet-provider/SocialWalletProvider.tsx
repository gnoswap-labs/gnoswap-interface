import React from "react";
import { AdenaSDK, GnoSocialWalletProvider } from "@adena-wallet/sdk";

import { SocialWalletLoginType } from "./types";

import {
  SOCIAL_WALLET_AUTH_CLIENT_ID,
  SOCIAL_WALLET_AUTH_DOMAIN,
  SOCIAL_WALLET_EMAIL_VERIFIER,
  SOCIAL_WALLET_GOOGLE_VERIFIER,
  SOCIAL_WALLET_TWITTER_VERIFIER,
  SOCIAL_WALLET_WEB3AUTH_CLIENT_ID,
} from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useAtom } from "jotai";
import { WalletState } from "@states/index";
import { SocialWalletClient } from "@common/clients/wallet-client/social/social-wallet-client";
import { ACCOUNT_SESSION_INFO_KEY } from "@states/common";

interface SocialWalletConfig {
  chainId: string;
  clientId: string;
  authClientId: string;
  network: "testnet" | "mainnet";
  rpcTarget: string;
  domain: string;
  name: string;
  verifier: string;
}

interface SocialWalletContextType {
  sdk: AdenaSDK | null;
  address: string | null;
  connectingState: "initial" | "loading" | "error" | "done" | "";
  connect: (type: SocialWalletLoginType) => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

export const SocialWalletContext = React.createContext<SocialWalletContextType | null>(null);

const getSocialWalletConfig = (type: SocialWalletLoginType): SocialWalletConfig => {
  const baseConfig: SocialWalletConfig = {
    chainId: "0x1",
    clientId: SOCIAL_WALLET_WEB3AUTH_CLIENT_ID,
    authClientId: SOCIAL_WALLET_AUTH_CLIENT_ID,
    network: "testnet",
    rpcTarget: "https://rpc.test4.gno.land",
    domain: SOCIAL_WALLET_AUTH_DOMAIN,
    name: "Adena Wallet",
    verifier: "",
  };

  switch (type) {
    case "email":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_EMAIL_VERIFIER,
      };
    case "google":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_GOOGLE_VERIFIER,
      };
    case "twitter":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_TWITTER_VERIFIER,
      };
  }
};

export const SocialWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { accountRepository } = useGnoswapContext();
  const [sdk, setSdk] = React.useState<AdenaSDK | null>(null);
  const [address, setAddress] = React.useState<string | null>(null);
  const [connectingState, setConnectingState] = React.useState<"initial" | "loading" | "error" | "done" | "">(
    "initial",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [, setWalletClient] = useAtom(WalletState.client);
  const [, setWalletAccount] = useAtom(WalletState.account);

  const createSocialWalletProvider = React.useCallback((type: SocialWalletLoginType) => {
    const config = getSocialWalletConfig(type);

    switch (type) {
      case "email":
        return GnoSocialWalletProvider.createEmail(config);
      case "google":
        return GnoSocialWalletProvider.createGoogle(config);
      case "twitter":
        return GnoSocialWalletProvider.createTwitter(config);
    }
  }, []);

  // @dev SocialWalletClient connection logic will be used
  // const connectSocialWalletClient = React.useCallback(
  //   async (type: SocialWalletLoginType) => {
  //     if (loadingConnect !== "initial") {
  //       setLoadingConnect("loading");
  //     }
  //     const socialWallet = await SocialWalletClient.createSocialWalletClient(type);
  //     if (socialWallet !== null) {
  //       socialWallet.initSocialWallet(type);
  //     }
  //   },
  //   [loadingConnect],
  // );

  const connect = React.useCallback(
    async (type: SocialWalletLoginType) => {
      try {
        setConnectingState("loading");
        setError(null);

        const socialWalletClient = await SocialWalletClient.createSocialWalletClient(type);
        if (!socialWalletClient) {
          throw new Error("Failed to create socail wallet client");
        }

        setWalletClient(socialWalletClient);
        accountRepository.setWalletClient(socialWalletClient);

        const established = await accountRepository.addEstablishedSite().catch(() => null);

        if (established === null) {
          return;
        }
        if (established.code === 4000) {
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
          setTimeout(() => {
            setConnectingState("initial");
          }, 1000);
        } else {
          accountRepository.setConnectedWallet(false);
          setConnectingState("error");
          setTimeout(() => {
            setConnectingState("initial");
          }, 1000);
        }
      } catch (err) {
        setConnectingState("error");
        setError(err instanceof Error ? err.message : "Failed to connect Social Wallet");
      }
    },
    [createSocialWalletProvider],
  );

  const disconnect = React.useCallback(async () => {
    try {
      if (sdk) {
        await sdk.disconnectWallet();
        setSdk(null);
        setAddress(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect Social Wallet");
    }
  }, [sdk]);

  return (
    <SocialWalletContext.Provider value={{ sdk, address, connect, connectingState, disconnect, error }}>
      {children}
    </SocialWalletContext.Provider>
  );
};
