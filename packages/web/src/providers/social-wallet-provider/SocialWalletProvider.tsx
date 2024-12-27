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
  isConnecting: boolean;
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
  const [sdk, setSdk] = React.useState<AdenaSDK | null>(null);
  const [address, setAddress] = React.useState<string | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  const connect = React.useCallback(
    async (type: SocialWalletLoginType) => {
      try {
        setIsConnecting(true);
        setError(null);

        const socialWallet = createSocialWalletProvider(type);
        const newSdk = new AdenaSDK(socialWallet);
        await newSdk.connectWallet();

        const newAddress = await socialWallet.getWallet()?.getAddress();

        setSdk(newSdk);
        setAddress(newAddress || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect Social Wallet");
      } finally {
        setIsConnecting(false);
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
    <SocialWalletContext.Provider value={{ sdk, address, isConnecting, connect, disconnect, error }}>
      {children}
    </SocialWalletContext.Provider>
  );
};
