export const HEADER_NAV = [
  {
    title: "Swap",
    path: "/swap",
    subPath: ["/tokens/"],
  },
  {
    title: "Earn",
    path: "/earn",
    subPath: ["/earn/pool/", "/earn/add", "/earn/stake"],
  },
  {
    title: "Wallet",
    path: "/wallet",
  },
  {
    title: "Leaderboard",
    path: "/leaderboard",
  },
];

export const SIDE_MENU_NAV = [
  {
    title: "Dashboard",
    path: "/dashboard",
    iconType: "PULSE",
  },
  {
    title: "Governance",
    path: "/governance",
    iconType: "ACCOUNT_USER",
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
