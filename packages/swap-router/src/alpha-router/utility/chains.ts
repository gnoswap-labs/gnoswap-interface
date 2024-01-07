import { ChainId, Token, WGNOT } from "../core";

// WIP: Gnosis, Moonbeam
export const SUPPORTED_CHAINS: ChainId[] = [
  ChainId.MAINNET,
  ChainId.BETA_GNOSWAP,
  ChainId.DEV_GNOSWAP,
];

export const ID_TO_CHAIN_ID = (id: number): ChainId => {
  switch (id) {
    case 1:
      return ChainId.MAINNET;
    case 2:
      return ChainId.TEST3;
    case 3:
      return ChainId.BETA_GNOSWAP;
    case 4:
    default:
      return ChainId.DEV_GNOSWAP;
  }
};

export enum ChainName {
  MAINNET = "mainnet",
  TEST3 = "test3",
  BETA_GNOSWAP = "beta.gnoswap",
  DEV_GNOSWAP = "dev.gnoswap",
}

export const NAME_TO_CHAIN_ID = (name: string): ChainId => {
  switch (name) {
    case ChainName.MAINNET:
      return ChainId.MAINNET;
    case ChainName.TEST3:
      return ChainId.TEST3;
    case ChainName.BETA_GNOSWAP:
      return ChainId.BETA_GNOSWAP;
    case ChainName.DEV_GNOSWAP:
    default:
      return ChainId.DEV_GNOSWAP;
  }
};

export enum NativeCurrencyName {
  // Strings match input for CLI
  GNOT = "GNOT",
}

export const NATIVE_NAMES_BY_ID: { [chainId: number]: string[] } = {
  [ChainId.MAINNET]: ["GNOT", "GNOT", "gnot"],
  [ChainId.TEST3]: ["GNOT", "GNOT", "gnot"],
  [ChainId.BETA_GNOSWAP]: ["GNOT", "GNOT", "gnot"],
  [ChainId.DEV_GNOSWAP]: ["GNOT", "GNOT", "gnot"],
};

export const NATIVE_CURRENCY: { [chainId: number]: NativeCurrencyName } = {
  [ChainId.MAINNET]: NativeCurrencyName.GNOT,
  [ChainId.TEST3]: NativeCurrencyName.GNOT,
  [ChainId.BETA_GNOSWAP]: NativeCurrencyName.GNOT,
  [ChainId.DEV_GNOSWAP]: NativeCurrencyName.GNOT,
};

export const ID_TO_NETWORK_NAME = (id: number): ChainName => {
  switch (id) {
    case 1:
      return ChainName.MAINNET;
    case 2:
      return ChainName.TEST3;
    case 3:
      return ChainName.BETA_GNOSWAP;
    case 4:
    default:
      return ChainName.DEV_GNOSWAP;
  }
};

export const CHAIN_IDS_LIST = Object.values(ChainId).map(c =>
  c.toString(),
) as string[];

export const ID_TO_PROVIDER = (id: ChainId): string => {
  switch (id) {
    case ChainId.MAINNET:
      return process.env.JSON_RPC_PROVIDER!;
    case ChainId.TEST3:
      return process.env.JSON_RPC_PROVIDER_TEST3!;
    case ChainId.BETA_GNOSWAP:
      return process.env.JSON_RPC_PROVIDER_BETA_GNOSWAP!;
    case ChainId.DEV_GNOSWAP:
      return process.env.JSON_RPC_PROVIDER_DEV_GNOSWAP!;
    default:
      throw new Error(`Chain id: ${id} not supported`);
  }
};

export const WRAPPED_NATIVE_CURRENCY: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: WGNOT[ChainId.MAINNET],
  [ChainId.TEST3]: WGNOT[ChainId.TEST3],
  [ChainId.BETA_GNOSWAP]: WGNOT[ChainId.BETA_GNOSWAP],
  [ChainId.DEV_GNOSWAP]: WGNOT[ChainId.DEV_GNOSWAP],
};

export const GNO_PROVIDER_RPC: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "https://dev.rpc.gnoswap.io",
  [ChainId.TEST3]: "https://dev.rpc.gnoswap.io",
  [ChainId.BETA_GNOSWAP]: "https://beta.rpc.gnoswap.io",
  [ChainId.DEV_GNOSWAP]: "https://dev.rpc.gnoswap.io",
};
