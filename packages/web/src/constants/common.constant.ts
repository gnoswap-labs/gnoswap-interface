import { GNS_TOKEN_PATH, WRAPPED_GNOT_PATH } from "./environment.constant";

export const DEFAULT_NETWORK_ID = "portal-loop";

export const PATH = ["/earn"];
// 10SECOND/60SECOND is the specific time for data refetching cycles. `useGetPositionsByAddress` will refetch after these specific time
export const PATH_10SECOND = ["/earn/pool/remove", "/token"];
export const PATH_60SECOND = [
  "/wallet",
  "/earn/pool/stake",
  "/earn/pool/unstake",
  "/earn/pool",
];

export const HTTP_5XX_ERROR = [
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511,
];

export const CAN_SCROLL_UP_ID = "CAN_SCROLL_UP_ID";

export const getCanScrollUpId = (id: string) => `${CAN_SCROLL_UP_ID}_${id}`;

export type PageKey =
  | "/"
  | "/earn"
  | "/earn?address"
  | "/earn/add"
  | "/earn/incentivize"
  | "/earn/pool"
  | "/earn/pool?address"
  | "/earn/pool/add"
  | "/earn/pool/incentivize"
  | "/earn/pool/remove"
  | "/earn/pool/stake"
  | "/earn/pool/unstake"
  | "/earn/pool/position/reposition"
  | "/earn/pool/position/increase-liquidity"
  | "/earn/pool/position/decrease-liquidity"
  | "/token"
  | "/404"
  | "/500"
  | "/dashboard"
  | "/governance"
  | "/leaderboard"
  | "/swap"
  | "/wallet";

export type StringParamsArr = (string | undefined)[];

export type StringWithParamsArr = (params?: StringParamsArr) => string;

export const DefaultTitle = "The One-stop Gnoland DeFi Platform | GnoSwap";

export const SEOInfo: Record<
  PageKey,
  {
    title: StringWithParamsArr;
    desc: StringWithParamsArr;
    ogTitle?: StringWithParamsArr;
    ogDesc?: StringWithParamsArr;
  }
> = {
  "/": {
    title: () => DefaultTitle,
    desc: () =>
      "The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders.",
    ogTitle: () => DefaultTitle,
    ogDesc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/earn": {
    title: () => "Earn | GnoSwap",
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/earn?address": {
    title: (params = []) => {
      if (params.length === 1) {
        const [address] = params;
        return `${address} | Positions | Earn on GnoSwap`;
      }
      return "Earn | GnoSwap";
    },
    desc: () =>
      "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/add": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Add Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Add Position to GnoSwap Pools";
    },
    desc: () =>
      "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/incentivize": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Incentivize ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Incentivize GnoSwap Pools";
    },
    desc: () =>
      "Add incentives to pools for liquidity providers to bootstrap liquidity.",
  },
  "/earn/pool": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `${tokenASymbol}/${tokenBSymbol} ${feeTier} | Earn on GnoSwap`;
      }
      return DefaultTitle;
    },
    desc: () =>
      "Provide liquidity to earn trading fees and staking rewards. GnoSwap's concentrated liquidity maximizes your earnings by amplifying your capital efficiency.",
  },
  "/earn/pool?address": {
    title: (params = []) => {
      if (params.length === 4) {
        const [address, tokenASymbol, tokenBSymbol, feeTier] = params;
        return `${address} | ${tokenASymbol}/${tokenBSymbol} ${feeTier} | Earn on GnoSwap`;
      }
      return DefaultTitle;
    },
    desc: () =>
      "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/pool/add": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Add Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Add Position to GnoSwap Pools";
    },
    desc: () => "",
    ogTitle: () => "",
    ogDesc: () => "",
  },
  "/earn/pool/incentivize": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Incentivize ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Incentivize GnoSwap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/remove": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Remove Position from ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Remove Position from GnoSwap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/stake": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Stake Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Stake Position to GnoSwap Pools";
    },
    desc: () =>
      "Create your own positions and provide liquidity to earn staking rewards.",
  },
  "/earn/pool/unstake": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Unstake Position from ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Unstake Position from GnoSwap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/position/reposition": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Reposition in #${positionId}`;
      }
      return "Reposition";
    },
    desc: () => "",
    ogTitle: () => "",
    ogDesc: () => "",
  },
  "/earn/pool/position/increase-liquidity": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Increase liquidity in #${positionId}`;
      }
      return "Increase liquidity";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/position/decrease-liquidity": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Decrease liquidity in #${positionId}`;
      }
      return "Decrease liquidity";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/token": {
    title: (params = []) => {
      const [tokenPrice, tokenName, tokenSymbol] = params;
      const tokenSymbolDisplay = tokenSymbol ? `(${tokenSymbol})` : "";
      const tokenNameDisplay = `${tokenName}${tokenSymbolDisplay}`;
      const titleDisplay = [tokenPrice, tokenNameDisplay]
        .filter(item => item)
        .join(" | ");

      if (tokenName && tokenSymbol && tokenPrice) return titleDisplay;

      return DefaultTitle;
    },
    desc: (params = []) => {
      if (params.length === 1) {
        const [tokenSymbol] = params;
        return `Buy or Sell ${tokenSymbol} on GnoSwap.`;
      }

      return "Buy or Sell Token on GnoSwap.";
    },
    ogTitle: (params = []) => {
      if (params.length === 2) {
        const [tokenName, tokenSymbol] = params;
        return `${tokenName}(${tokenSymbol}) | GnoSwap`;
      }
      return DefaultTitle;
    },
  },
  "/404": {
    title: () => "404: Page not found!",
    desc: () => "404: Page not found!",
  },
  "/500": {
    title: () => "Page Unavailable!",
    desc: () => "Page Unavailable!",
  },
  "/dashboard": {
    title: () => "Dashboard | GnoSwap",
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/governance": {
    title: () => "Governance | GnoSwap",
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/leaderboard": {
    title: () => "Leaderboard | GnoSwap",
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/swap": {
    title: (params = []) => {
      if (params.length === 2) {
        const [tokenASymbol, tokenBSymbol] = params;
        return `Swap ${tokenASymbol} to ${tokenBSymbol} | GnoSwap`;
      }
      return "Swap | GnoSwap";
    },
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/wallet": {
    title: () => "Wallet | GnoSwap",
    desc: () =>
      "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
};

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
];

export const DEFAULT_TOKEN_PAIR = [WRAPPED_GNOT_PATH, GNS_TOKEN_PATH];

export const DEFAULT_POOL_PATH = [...DEFAULT_TOKEN_PAIR.sort(), "3000"].join(
  ":",
);
