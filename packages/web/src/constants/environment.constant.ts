const ENV_VARIABLES = {
  CHAINS: process.env.NEXT_PUBLIC_CHAINS?.split(",") || [],
  DEFAULT_CHAIN_ID: process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  ROUTER_API_URL: process.env.NEXT_PUBLIC_ROUTER_API_URL || "",
  DEV_CHAIN_ID: process.env.NEXT_PUBLIC_DEV_CHAIN_ID || "",
  DEV_API_URL: process.env.NEXT_PUBLIC_DEV_API_URL || "",
  DEV_ROUTER_API_URL: process.env.NEXT_PUBLIC_DEV_ROUTER_API_URL || "",
  PACKAGE_GNOSWAP_CONST_PATH:
    process.env.NEXT_PUBLIC_PACKAGE_GNOSWAP_CONST_PATH || "",
  PACKAGE_ROUTER_PATH: process.env.NEXT_PUBLIC_PACKAGE_ROUTER_PATH || "",
  PACKAGE_POOL_PATH: process.env.NEXT_PUBLIC_PACKAGE_POOL_PATH || "",
  PACKAGE_POSITION_PATH: process.env.NEXT_PUBLIC_PACKAGE_POSITION_PATH || "",
  PACKAGE_STAKER_PATH: process.env.NEXT_PUBLIC_PACKAGE_STAKER_PATH || "",
  PACKAGE_NFT_PATH: process.env.NEXT_PUBLIC_PACKAGE_NFT_PATH || "",
  GOVERNANCE_PATH: process.env.NEXT_PUBLIC_GOVERNANCE_PATH || "",
  WRAPPED_GNOT_PATH: process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "",
  GNS_TOKEN_PATH: process.env.NEXT_PUBLIC_GNS_TOKEN_PATH || "",
  PACKAGE_ROUTER_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_ROUTER_ADDRESS || "",
  PACKAGE_POOL_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_POOL_ADDRESS || "",
  PACKAGE_POSITION_ADDRESS:
    process.env.NEXT_PUBLIC_PACKAGE_POSITION_ADDRESS || "",
  PACKAGE_STAKER_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_STAKER_ADDRESS || "",
  PACKAGE_GOVERNANCE_ADDRESS:
    process.env.NEXT_PUBLIC_PACKAGE_GOVERNANCE_ADDRESS || "",
  BLOCKED_PAGES: process.env.NEXT_PUBLIC_BLOCKED_PAGES?.split(",") || [],
  UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
};

const currentEnvVariables = ENV_VARIABLES;

export const CHAINS = currentEnvVariables.CHAINS;
export const DEFAULT_CHAIN_ID = currentEnvVariables.DEFAULT_CHAIN_ID;
export const API_URL = currentEnvVariables.API_URL;
export const ROUTER_API_URL = currentEnvVariables.ROUTER_API_URL;
export const DEV_CHAIN_ID = currentEnvVariables.DEV_CHAIN_ID;
export const DEV_API_URL = currentEnvVariables.DEV_API_URL;
export const DEV_ROUTER_API_URL = currentEnvVariables.DEV_ROUTER_API_URL;
export const PACKAGE_GNOSWAP_CONST_PATH =
  currentEnvVariables.PACKAGE_GNOSWAP_CONST_PATH;
export const PACKAGE_ROUTER_PATH = currentEnvVariables.PACKAGE_ROUTER_PATH;
export const PACKAGE_POOL_PATH = currentEnvVariables.PACKAGE_POOL_PATH;
export const PACKAGE_POSITION_PATH = currentEnvVariables.PACKAGE_POSITION_PATH;
export const PACKAGE_STAKER_PATH = currentEnvVariables.PACKAGE_STAKER_PATH;
export const PACKAGE_NFT_PATH = currentEnvVariables.PACKAGE_NFT_PATH;
export const GOVERNANCE_PATH = currentEnvVariables.GOVERNANCE_PATH;
export const WRAPPED_GNOT_PATH = currentEnvVariables.WRAPPED_GNOT_PATH;
export const GNS_TOKEN_PATH = currentEnvVariables.GNS_TOKEN_PATH;
export const PACKAGE_ROUTER_ADDRESS =
  currentEnvVariables.PACKAGE_ROUTER_ADDRESS;
export const PACKAGE_POOL_ADDRESS = currentEnvVariables.PACKAGE_POOL_ADDRESS;
export const PACKAGE_POSITION_ADDRESS =
  currentEnvVariables.PACKAGE_POSITION_ADDRESS;
export const PACKAGE_STAKER_ADDRESS =
  currentEnvVariables.PACKAGE_STAKER_ADDRESS;
export const PACKAGE_GOVERNANCE_ADDRESS =
  currentEnvVariables.PACKAGE_GOVERNANCE_ADDRESS;
export const BLOCKED_PAGES = currentEnvVariables.BLOCKED_PAGES;
export const UMAMI_SCRIPT_URL = currentEnvVariables.UMAMI_SCRIPT_URL;
export const UMAMI_WEBSITE_ID = currentEnvVariables.UMAMI_WEBSITE_ID;
