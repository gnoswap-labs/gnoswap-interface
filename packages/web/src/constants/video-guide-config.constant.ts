import { VideoGuideType } from "./youtube-links.constant";

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
      url: "https://docs.gnoswap.io",
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
