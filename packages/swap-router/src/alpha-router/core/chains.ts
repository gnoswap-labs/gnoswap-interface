export enum ChainId {
  MAINNET = 1,
  TEST3 = 2,
  BETA_GNOSWAP = 3,
  DEV_GNOSWAP = 4,
}

export const SUPPORTED_CHAINS = [
  ChainId.MAINNET,
  ChainId.TEST3,
  ChainId.BETA_GNOSWAP,
  ChainId.DEV_GNOSWAP,
] as const;
export type SupportedChainsType = typeof SUPPORTED_CHAINS[number];

export enum NativeCurrencyName {
  // Strings match input for CLI
  GNOT = "GNOT",
}
