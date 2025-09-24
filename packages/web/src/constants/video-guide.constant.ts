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
  [VIDEO_GUIDE_TYPES.STAKING]: "gv0Xqq3DXFk",
  [VIDEO_GUIDE_TYPES.GOVERNANCE]: "gv0Xqq3DXFk",
  [VIDEO_GUIDE_TYPES.LEADERBOARD]: "gv0Xqq3DXFk",
  [VIDEO_GUIDE_TYPES.LAUNCHPAD]: "gv0Xqq3DXFk",
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
      key: "What’s a Position?",
    },
    subtitle: {
      key: "Learn about positions and how to provide liquidity to earn rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io",
    },
    internalAction: {
      textKey: "Create a Position",
      route: "/earn/add",
    },
  },
  GOVERNANCE: {
    title: {
      key: "What’s a Position?",
    },
    subtitle: {
      key: "Learn about positions and how to provide liquidity to earn rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io",
    },
    internalAction: {
      textKey: "Create a Position",
      route: "/earn/add",
    },
  },
  LAUNCHPAD: {
    title: {
      key: "What’s a Position?",
    },
    subtitle: {
      key: "Learn about positions and how to provide liquidity to earn rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io",
    },
    internalAction: {
      textKey: "Create a Position",
      route: "/earn/add",
    },
  },
  LEADERBOARD: {
    title: {
      key: "What’s a Position?",
    },
    subtitle: {
      key: "Learn about positions and how to provide liquidity to earn rewards on GnoSwap.",
    },
    externalLink: {
      textKey: "Learn More",
      url: "https://docs.gnoswap.io",
    },
    internalAction: {
      textKey: "Create a Position",
      route: "/earn/add",
    },
  },
};
