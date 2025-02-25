export type WalletType = "ADENA" | "SOCIAL_WALLET";
export type SocialLoginType = "email" | "google" | "twitter";

export interface WalletTypeState {
  type: WalletType | null;
  socialType: SocialLoginType | null;
}
export interface WalletConnectParams {
  walletType: WalletType;
  socialLoginType?: SocialLoginType;
}
