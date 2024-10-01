export const PAGE_PATH = {
  HOME: "/",
  TOKEN: "/token",
  EARN: "/earn",
  EARN_ADD: "/earn/add",
  GOVERNANCE: "/governance",
  LEADERBOARD: "/leaderboard",
  SWAP: "/swap",
  WALLET: "/wallet",
  Launchpad: "/launchpad",
  POOL: "/earn/pool",
  POOL_ADD: "/earn/pool/add",
  POOL_REMOVE: "/earn/pool/remove",
  POOL_INCENTIVIZE: "/earn/pool/incentivize",
  POOL_STAKE: "/earn/pool/stake",
  POOL_UNSTAKE: "/earn/pool/unstake",
  POSITION_REPOSITION: "/earn/pool/position/reposition",
  POSITION_INCREASE_LIQUIDITY: "/earn/pool/position/increase-liquidity",
  POSITION_DECREASE_LIQUIDITY: "/earn/pool/position/decrease-liquidity",
  DASHBOARD: "/dashboard",
  "404": "/404",
  "500": "/500",
} as const;

export type PAGE_PATH_TYPE = keyof typeof PAGE_PATH;

export const QUERY_PARAMETER = {
  TOKEN_PATH: "path",
  POOL_PATH: "poolPath",
  POSITION_ID: "positionId",
  ADDRESS: "addr",
} as const;

export type QUERY_PARAMETER_TYPE = keyof typeof QUERY_PARAMETER;
