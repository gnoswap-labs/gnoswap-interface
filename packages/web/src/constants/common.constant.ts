export const DEFAULT_NETWORK_ID = "portal-loop";

export const PATH = ["/earn"];
// 10SECOND/60SECOND is the specific time for data refetching cycles. `useGetPositionsByAddress` will refetch after these specific time
export const PATH_10SECOND = [
  "/earn/pool/[pool-path]/remove",
  "/tokens/[token-path]",
];
export const PATH_60SECOND = [
  "/wallet",
  "/earn/pool/[pool-path]/stake",
  "/earn/pool/[pool-path]/unstake",
  "/earn/pool/[pool-path]",
];

export const HTTP_5XX_ERROR = [500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511];

export const CAN_SCROLL_UP_ID = "CAN_SCROLL_UP_ID";

export const getCanScrollUpId = (id: string) => `${CAN_SCROLL_UP_ID}_${id}`;

export type PageKey =
  "/"
  | "/earn"
  | "/earn?address"
  | "/earn/add"
  | "/earn/incentivize"
  | "/earn/pool/[pool-path]"
  | "/earn/pool/[pool-path]?address"
  | "/earn/pool/[pool-path]/add"
  | "/earn/pool/[pool-path]/incentivize"
  | "/earn/pool/[pool-path]/remove"
  | "/earn/pool/[pool-path]/stake"
  | "/earn/pool/[pool-path]/unstake"
  | "/earn/pool/[pool-path]/[position-id]/reposition"
  | "/earn/pool/[pool-path]/[position-id]/increase-liquidity"
  | "/earn/pool/[pool-path]/[position-id]/decrease-liquidity"
  | "token/[token-path]"
  | "/404"
  | "/500"
  | "/dashboard"
  | "/governance"
  | "/leaderboard"
  | "/swap"
  | "/wallet";

export type StringParamsArr = (string | undefined)[];

export type StringWithParamsArr = (params?: StringParamsArr) => string;

export const DefaultTitle = "The One-stop Gnoland DeFi Platform | Gnoswap";

export const SEOInfo: Record<PageKey, {
  title: StringWithParamsArr;
  desc: StringWithParamsArr;
  ogTitle?: StringWithParamsArr;
  ogDesc?: StringWithParamsArr;
}> = {
  "/": {
    title: () => DefaultTitle,
    desc: () => "The first Concentrated Liquidity AMM DEX built using Gnolang to offer the most simplified and user-friendly DeFi experience for traders.",
    ogTitle: () => DefaultTitle,
    ogDesc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/earn": {
    title: () => "Earn | Gnoswap",
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/earn?address": {
    title: (params = []) => {
      if (params.length === 1) {
        const [address] = params;
        return `${address} | Positions | Earn on Gnoswap`;
      }
      return "Earn | Gnoswap";
    },
    desc: () => "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/add": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Add Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Add Position to Gnoswap Pools";
    },
    desc: () => "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/incentivize": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Incentivize ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Incentivize Gnoswap Pools";
    },
    desc: () => "Add incentives to pools for liquidity providers to bootstrap liquidity.",
  },
  "/earn/pool/[pool-path]": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `${tokenASymbol}/${tokenBSymbol} ${feeTier} | Earn on Gnoswap`;
      }
      return DefaultTitle;
    },
    desc: () => "Provide liquidity to earn trading fees and staking rewards. GnoSwap's concentrated liquidity maximizes your earnings by amplifying your capital efficiency.",
  },
  "/earn/pool/[pool-path]?address": {
    title: (params = []) => {
      if (params.length === 4) {
        const [address, tokenASymbol, tokenBSymbol, feeTier] = params;
        return `${address} | ${tokenASymbol}/${tokenBSymbol} ${feeTier} | Earn on Gnoswap`;
      }
      return DefaultTitle;
    },
    desc: () => "Create your own positions and provide liquidity to earn trading fees.",
  },
  "/earn/pool/[pool-path]/add": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Add Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Add Position to Gnoswap Pools";
    },
    desc: () => "",
    ogTitle: () => "",
    ogDesc: () => "",
  },
  "/earn/pool/[pool-path]/incentivize": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Incentivize ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Incentivize Gnoswap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/[pool-path]/remove": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Remove Position from ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Remove Position from Gnoswap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/[pool-path]/stake": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Stake Position to ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Stake Position to Gnoswap Pools";
    },
    desc: () => "Create your own positions and provide liquidity to earn staking rewards.",
  },
  "/earn/pool/[pool-path]/unstake": {
    title: (params = []) => {
      if (params.length === 3) {
        const [tokenASymbol, tokenBSymbol, feeTier] = params;
        return `Unstake Position from ${tokenASymbol}/${tokenBSymbol} ${feeTier}`;
      }
      return "Unstake Position from Gnoswap Pools";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/[pool-path]/[position-id]/reposition": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Reposition in ${positionId}`;
      }
      return "Reposition";
    },
    desc: () => "",
    ogTitle: () => "",
    ogDesc: () => "",
  },
  "/earn/pool/[pool-path]/[position-id]/increase-liquidity": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Increase liquidity in ${positionId}`;
      }
      return "Increase liquidity";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "/earn/pool/[pool-path]/[position-id]/decrease-liquidity": {
    title: (params = []) => {
      if (params.length === 1) {
        const [positionId] = params;
        return `Decrease liquidity in ${positionId}`;
      }
      return "Decrease liquidity";
    },
    desc: () => "Manage your positions to earn trading fees.",
  },
  "token/[token-path]": {
    title: (params = []) => {
      // Template => `$1.02 | Gnoswap(GNS)`
      const [tokenPrice, tokenName, tokenSymbol] = params;
      const tokenSymbolDisplay = tokenSymbol ? `(${tokenSymbol})` : "";
      const tokenNameDisplay = `${tokenName}${tokenSymbolDisplay}`;
      const titleDisplay = [tokenPrice, tokenNameDisplay].filter(item => item).join(" | ");

      if (titleDisplay && tokenName && tokenSymbol) return titleDisplay;

      return DefaultTitle;
    },
    desc: (params = []) => {
      if (params.length === 1) {
        const [tokenSymbol] = params;
        return `Buy or Sell ${tokenSymbol} on Gnoswap.`;
      }

      return "Buy or Sell Token on Gnoswap.";
    },
    ogTitle: (params = []) => {
      if (params.length === 2) {
        const [tokenName, tokenSymbol] = params;
        return `${tokenName}(${tokenSymbol}) | Gnoswap`;
      }
      return DefaultTitle;
    }
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
    title: () => "Dashboard | Gnoswap",
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/governance": {
    title: () => "Governance | Gnoswap",
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/leaderboard": {
    title: () => "Leaderboard | Gnoswap",
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/swap": {
    title: (params = []) => {
      if (params.length === 2) {
        const [tokenASymbol, tokenBSymbol] = params;
        return `Swap ${tokenASymbol} to ${tokenBSymbol} | Gnoswap`;
      }
      return "Swap | Gnoswap";
    },
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },
  "/wallet": {
    title: () => "Wallet | Gnoswap",
    desc: () => "Swap and earn on the most powerful decentralized exchange (DEX) built on Gno.land with concentrated liquidity.",
  },

};