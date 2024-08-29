import { EXT_URL } from "./external-url.contant";

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
    title: "HeaderFooter:dashboard",
    path: "/dashboard",
    iconType: null,
    subPath: [],
  },
];

export const SIDE_MENU_NAV = [
  {
    title: "HeaderFooter:leaderboard",
    path: "/leaderboard",
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
    path: EXT_URL.SOCIAL.DISCORD,
    iconType: "OPEN_LINK",
  },
  {
    title: "HeaderFooter:documentation",
    path: EXT_URL.DOCS.ROOT,
    iconType: "OPEN_LINK",
  },
  {
    title: "HeaderFooter:legal",
    path: "/",
    iconType: "OPEN_LINK",
  },
] as const;
