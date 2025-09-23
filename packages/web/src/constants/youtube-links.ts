export const YOUTUBE_LINKS = {
  POSITION: "gv0Xqq3DXFk",
  STAKING: "gv0Xqq3DXFk",
  GOVERNANCE: "gv0Xqq3DXFk",
  LAUNCHPAD: "gv0Xqq3DXFk",
  LEADERBOARD: "gv0Xqq3DXFk",
} as const;

export type YoutubeVideoType = keyof typeof YOUTUBE_LINKS;
