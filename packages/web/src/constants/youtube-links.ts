export const YOUTUBE_LINKS = {
  POSITION: "dQw4w9WgXcQ",
  STAKING: "abc123def45",
  GOVERNANCE: "xyz789uvw12",
  LAUNCHPAD: "def456ghi78",
  LEADERBOARD: "ghi789jkl01",
} as const;

export type YoutubeVideoType = keyof typeof YOUTUBE_LINKS;
