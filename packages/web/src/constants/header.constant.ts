export const HEADER_NAV = [
  {
    title: "HeaderFooter:swap",
    path: "/swap",
    iconType: null,
    subPath: ["/token"],
  },
  {
    title: "HeaderFooter:earn",
    path: "/earn",
    iconType: null,
    subPath: ["/earn/pool/", "/earn/add", "/earn/stake"],
  },
  {
    title: "HeaderFooter:wallet",
    path: "/wallet",
    iconType: null,
    subPath: [],
  },
  {
    title: "HeaderFooter:leaderboard",
    path: "/leaderboard",
    iconType: null,
    subPath: [],
  },
];

export const SIDE_MENU_NAV = [
  {
    title: "HeaderFooter:dashboard",
    path: "/dashboard",
    iconType: "PULSE",
    subPath: [],
  },
  {
    title: "HeaderFooter:governance",
    path: "/governance",
    iconType: "ACCOUNT_USER",
    subPath: [],
  },
] as const;

export const SIDE_EXTRA_MENU_NAV = [
  {
    title: "HeaderFooter:helpCenter",
    path: "https://discord.gg/u4bdGHStb2",
    iconType: "OPEN_LINK",
  },
  {
    title: "HeaderFooter:documentation",
    path: "https://docs.gnoswap.io/",
    iconType: "OPEN_LINK",
  },
  {
    title: "HeaderFooter:legal",
    path: "/",
    iconType: "OPEN_LINK",
  },
] as const;
