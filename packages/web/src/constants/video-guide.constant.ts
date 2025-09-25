export const VIDEO_GUIDE_TYPES = {
  POSITION: "POSITION",
  STAKING: "STAKING",
  GOVERNANCE: "GOVERNANCE",
  LAUNCHPAD: "LAUNCHPAD",
  LEADERBOARD: "LEADERBOARD",
} as const;

export type VideoGuideType = keyof typeof VIDEO_GUIDE_TYPES;

export const YOUTUBE_LINKS = {
  [VIDEO_GUIDE_TYPES.POSITION]: "gv0Xqq3DXFk",
  [VIDEO_GUIDE_TYPES.STAKING]: "TfSzp1_MaOI",
  [VIDEO_GUIDE_TYPES.GOVERNANCE]: "OqJgfkpUzxU",
  [VIDEO_GUIDE_TYPES.LEADERBOARD]: "3czMK3s30KQ",
  [VIDEO_GUIDE_TYPES.LAUNCHPAD]: "JQh7LhqW7ns",
};

export type VideoGuideConfigType = {
  title: { key: string };
  subtitle: { key: string };
  externalLink: { textKey: string; url: string };
  internalAction: { textKey: string; route: string };
};

export const VIDEO_GUIDE_CONFIG: Record<VideoGuideType, VideoGuideConfigType> = {
  POSITION: {
    title: {
      key: "What’s a Position?",
    },
    subtitle: {
      key: "Learn about positions and how to provide liquidity to earn rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io/user-guide/providing-liquidity/create-a-position",
    },
    internalAction: {
      textKey: "Create a Position",
      route: "/earn/add",
    },
  },
  STAKING: {
    title: {
      key: "How Does Staking Work?",
    },
    subtitle: {
      key: "Learn about staking and how to stake your position to maximize rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io/core-concepts/liquidity-mining",
    },
    internalAction: {
      textKey: "Stake a Position",
      route: "/earn/pool/stake?poolPath=",
    },
  },
  GOVERNANCE: {
    title: {
      key: "How Does GnoSwap Governance Work?",
    },
    subtitle: {
      key: "Learn about GnoSwap Governance and how to obtain xGNS to earn a portion of protocol fees on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io/core-concepts/governance",
    },
    internalAction: {
      textKey: "Delegate GNS",
      route: "",
    },
  },
  LAUNCHPAD: {
    title: {
      key: "How to Participate in GnoSwap Launchpad?",
    },
    subtitle: {
      key: "Learn about GnoSwap Launchpad and how to participate to a project token launching on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io/core-concepts/launchpad",
    },
    internalAction: {
      textKey: "Participate Now",
      route: "/launchpad#project-list",
    },
  },
  LEADERBOARD: {
    title: {
      key: "What’s the Leaderboard?",
    },
    subtitle: {
      key: "Learn about GnoSwap Leaderboard and how to rank up to earn potential rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io/references/leaderboard",
    },
    internalAction: {
      textKey: "Explore Now",
      route: "/leaderboard",
    },
  },
};
