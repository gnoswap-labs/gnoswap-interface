export type WalletType = "ADENA" | "SOCIAL_WALLET";
export type SocialLoginType = "email" | "google" | "twitter";

export interface WalletConnectParams {
  walletType: WalletType;
  socialLoginType?: SocialLoginType;
}
