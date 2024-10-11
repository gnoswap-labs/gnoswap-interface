import { getAddressByPackagePath } from "@utils/package-utils";

// Network Config
export const SUPPORT_CHAIN_IDS =
  process.env.NEXT_PUBLIC_SUPPORT_CHAIN_IDS?.split(",") || [];

export const DEFAULT_CHAIN_NAME =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_NAME || "";
export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "";
export const DEFAULT_CHAIN_RPC_URL =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_RPC_URL || "";
export const DEFAULT_CHAIN_WS_URL =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_WS_URL || "";
export const DEFAULT_CHAIN_API_URL =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_API_URL || "";
export const DEFAULT_CHAIN_ROUTER_URL =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ROUTER_URL || "";
export const DEFAULT_CHAIN_SCANNER_URL =
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_SCANNER_URL || "";

// Contract Config
export const WRAPPED_GNOT_PATH =
  process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";
export const GNS_TOKEN_PATH = process.env.NEXT_PUBLIC_GNS_TOKEN_PATH || "";

export const PACKAGE_GNOSWAP_CONST_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_GNOSWAP_CONST_PATH || "";

export const PACKAGE_ROUTER_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH || "";
export const PACKAGE_ROUTER_ADDRESS =
  getAddressByPackagePath(PACKAGE_ROUTER_PATH);

export const PACKAGE_POOL_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "";
export const PACKAGE_POOL_ADDRESS = getAddressByPackagePath(PACKAGE_POOL_PATH);

export const PACKAGE_POSITION_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "";
export const PACKAGE_POSITION_ADDRESS = getAddressByPackagePath(
  PACKAGE_POSITION_PATH,
);

export const PACKAGE_STAKER_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_STAKER_PATH || "";
export const PACKAGE_STAKER_ADDRESS =
  getAddressByPackagePath(PACKAGE_STAKER_PATH);

export const PACKAGE_NFT_PATH = process.env.NEXT_PUBLIC_PACKAGE_NFT_PATH || "";

export const PACKAGE_GOVERNANCE_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_GOVERNANCE_PATH || "";

export const PACKAGE_GOVERNANCE_STAKER_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_GOVERNANCE_STAKER_PATH || "";

export const PACKAGE_GOVERNANCE_STAKER_ADDRESS = getAddressByPackagePath(
  PACKAGE_GOVERNANCE_STAKER_PATH,
);

export const PACKAGE_LAUNCHPAD_PATH =
  process.env.NEXT_PUBLIC_PACKAGE_LAUNCHPAD_PATH || "";

export const PACKAGE_LAUNCHPAD_ADDRESS = getAddressByPackagePath(
  PACKAGE_LAUNCHPAD_PATH,
);

// Webpage Config
export const BLOCKED_PAGES =
  process.env.NEXT_PUBLIC_BLOCKED_PAGES?.split(",") || [];
export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
