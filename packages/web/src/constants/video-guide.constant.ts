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
      key: "common:guide.position.title",
    },
    subtitle: {
      key: "common:guide.position.subtitle",
    },
    externalLink: {
      textKey: "common:learnMore",
      url: "https://docs.gnoswap.io/user-guide/providing-liquidity/create-a-position",
    },
    internalAction: {
      textKey: "common:guide.position.action",
      route: "/earn/add",
    },
  },
  STAKING: {
    title: {
      key: "common:guide.staking.title",
    },
    subtitle: {
      key: "common:guide.staking.subtitle",
    },
    externalLink: {
      textKey: "common:learnMore",
      url: "https://docs.gnoswap.io/core-concepts/liquidity-mining",
    },
    internalAction: {
      textKey: "common:guide.staking.action",
      route: "/earn/pool/stake?poolPath=",
    },
  },
  GOVERNANCE: {
    title: {
      key: "common:guide.governance.title",
    },
    subtitle: {
      key: "common:guide.governance.subtitle",
    },
    externalLink: {
      textKey: "common:learnMore",
      url: "https://docs.gnoswap.io/core-concepts/governance",
    },
    internalAction: {
      textKey: "common:guide.governance.action",
      route: "",
    },
  },
  LAUNCHPAD: {
    title: {
      key: "common:guide.launchpad.title",
    },
    subtitle: {
      key: "common:guide.launchpad.subtitle",
    },
    externalLink: {
      textKey: "common:learnMore",
      url: "https://docs.gnoswap.io/core-concepts/launchpad",
    },
    internalAction: {
      textKey: "common:guide.launchpad.action",
      route: "/launchpad#project-list",
    },
  },
  LEADERBOARD: {
    title: {
      key: "common:guide.leaderboard.title",
    },
    subtitle: {
      key: "common:guide.leaderboard.subtitle",
    },
    externalLink: {
      textKey: "common:learnMore",
      url: "https://docs.gnoswap.io/references/leaderboard",
    },
    internalAction: {
      textKey: "common:guide.leaderboard.action",
      route: "/leaderboard",
    },
  },
};
