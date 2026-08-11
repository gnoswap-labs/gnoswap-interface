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
    title: "HeaderFooter:portfolio",
    path: "/portfolio",
    iconType: null,
    subPath: [],
  },
  {
    title: "HeaderFooter:explore",
    path: "/explore",
    iconType: null,
    subPath: [],
  },
  {
    title: "HeaderFooter:leaderboard",
    path: "/leaderboard",
    iconType: null,
    subPath: [],
  },
  {
    title: "HeaderFooter:governance",
    path: "/governance",
    iconType: null,
    subPath: [],
  },
  {
    title: "HeaderFooter:launchpad",
    path: "/launchpad",
    iconType: null,
    subPath: ["/project"],
  },
];

export const SIDE_MENU_NAV = [
  // Example
  {
    title: "HeaderFooter:leaderboard",
    path: "/leaderboard",
    iconType: "LEADERBOARD",
    subPath: [],
  },
  {
    title: "HeaderFooter:governance",
    path: "/governance",
    iconType: "ACCOUNT_USER",
    subPath: [],
  },
  {
    title: "HeaderFooter:launchpad",
    path: "/launchpad",
    iconType: "LAUNCHPAD",
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
    path: "privacy",
    iconType: "OPEN_LINK",
  },
  {
    title: "HeaderFooter:gnoBridge",
    path: EXT_URL.BRIDGE,
    iconType: "OPEN_LINK",
  },
] as const;
