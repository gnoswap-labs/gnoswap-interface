import { SocialCustomConfigure, SocialGoogleConfigure, SocialTwitterConfigure } from "@adena-wallet/sdk";

import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_RPC_URL,
  SOCIAL_WALLET_AUTH_CLIENT_ID,
  SOCIAL_WALLET_AUTH_DOMAIN,
  SOCIAL_WALLET_EMAIL_VERIFIER,
  SOCIAL_WALLET_GOOGLE_CLIENT_ID,
  SOCIAL_WALLET_GOOGLE_VERIFIER,
  SOCIAL_WALLET_TWITTER_VERIFIER,
  SOCIAL_WALLET_WEB3AUTH_CLIENT_ID,
} from "@constants/environment.constant";
import { SocialLoginType } from "src/types/wallet.types";

const baseConfig = {
  chainId: DEFAULT_CHAIN_ID,
  name: "Adena Wallet",
  rpcTarget: DEFAULT_CHAIN_RPC_URL,
  network: "testnet" as const,
  clientId: SOCIAL_WALLET_WEB3AUTH_CLIENT_ID,
  authClientId: SOCIAL_WALLET_AUTH_CLIENT_ID,
  addressPrefix: "g",
};

export const getSocialWalletConfig = (
  type: SocialLoginType,
): SocialGoogleConfigure | SocialTwitterConfigure | SocialCustomConfigure => {
  switch (type) {
    case "google":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_GOOGLE_VERIFIER,
        googleClientId: SOCIAL_WALLET_GOOGLE_CLIENT_ID,
      };
    case "email":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_EMAIL_VERIFIER,
        domain: SOCIAL_WALLET_AUTH_DOMAIN,
      };
    case "twitter":
      return {
        ...baseConfig,
        verifier: SOCIAL_WALLET_TWITTER_VERIFIER,
        domain: SOCIAL_WALLET_AUTH_DOMAIN,
      };
    default:
      throw new Error("Unsupported social login type");
  }
};
