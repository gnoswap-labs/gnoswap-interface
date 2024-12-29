import {
  SOCIAL_WALLET_AUTH_CLIENT_ID,
  SOCIAL_WALLET_AUTH_DOMAIN,
  SOCIAL_WALLET_EMAIL_VERIFIER,
  SOCIAL_WALLET_GOOGLE_VERIFIER,
  SOCIAL_WALLET_TWITTER_VERIFIER,
  SOCIAL_WALLET_WEB3AUTH_CLIENT_ID,
} from "@constants/environment.constant";
import { SocialLoginType } from "src/types/wallet.types";

export interface SocialWalletConfig {
  chainId: string;
  clientId: string;
  authClientId: string;
  network: "testnet" | "mainnet";
  rpcTarget: string;
  domain: string;
  name: string;
  verifier: string;
}

export const getSocialWalletConfig = (type: SocialLoginType): SocialWalletConfig => {
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
    default:
      throw new Error("Unsupported social login type");
  }
};
