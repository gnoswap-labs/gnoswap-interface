export const HEADER_NAV = [
  {
    title: "Swap",
    path: "/swap",
    iconType: null,
    subPath: ["/tokens/"],
  },
  {
    title: "Earn",
    path: "/earn",
    iconType: null,
    subPath: ["/earn/pool/", "/earn/add", "/earn/stake"],
  },
  {
    title: "Wallet",
    path: "/wallet",
    iconType: null,
    subPath: [],
  },
  {
    title: "Leaderboard",
    path: "/leaderboard",
    iconType: null,
    subPath: [],
  },
];

export const SIDE_MENU_NAV = [
  {
    title: "Dashboard",
    path: "/dashboard",
    iconType: "PULSE",
    subPath: [],
  },
  {
    title: "Governance",
    path: "/governance",
    iconType: "ACCOUNT_USER",
    subPath: [],
  },
] as const;

export const SIDE_EXTRA_MENU_NAV = [
  {
    title: "Help Center",
    path: "https://discord.gg/u4bdGHStb2",
    iconType: "OPEN_LINK",
  },
  {
    title: "Documentation",
    path: "https://docs.gnoswap.io/",
    iconType: "OPEN_LINK",
  },
  {
    title: "Legal & Privacy",
    path: "/",
    iconType: "OPEN_LINK",
  },
] as const;
