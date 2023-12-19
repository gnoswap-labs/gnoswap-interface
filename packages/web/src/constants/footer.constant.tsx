import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconTelegram from "@components/common/icons/social/IconTelegram";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";

export const FOOTER_LEFT_NAV = {
  content:
    "Join Gnoswap - the fastest growing ecosystem aspiring to build the deepest source of liquidity on Gnoland.",
  menu: [
    {
      title: "github",
      icon: <IconGithub />,
      path: "https://github.com/gnoswap-labs/gnoswap",
    },
    {
      title: "gitbook",
      icon: <IconGitbook />,
      path: "https://docs.gnoswap.io/",
    },
    {
      title: "telegram",
      icon: <IconTelegram />,
      path: "https://t.me/gnoswap",
    },
    {
      title: "medium",
      icon: <IconMedium />,
      path: "https://medium.com/@gnoswaplabs",
    },
    {
      title: "twitter",
      icon: <IconTwitter />,
      path: "https://twitter.com/gnoswaplabs",
    },
  ],
};

export const FOOTER_RIGHT_NAV = [
  {
    content: "Features",
    menu: [
      {
        title: "Swap",
        path: "/swap",
        newTab: false,
      },
      {
        title: "Add Position",
        path: "/earn/add",
        newTab: false,
      },
      {
        title: "Stake Position",
        path: "/earn/stake",
        newTab: false,
      },
      {
        title: "Incentivize Pool",
        path: "/earn/incentivize",
        newTab: false,
      },
    ],
  },
  {
    content: "Help",
    menu: [
      {
        title: "About Us",
        path: "docs.gnoswap.io",
        newTab: true,
      },
      {
        title: "FAQ",
        path: "/",
        newTab: true,
      },
      {
        title: "Twitter (X)",
        path: "/",
        newTab: true,
      },
      {
        title: "Project Onboarding",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "Developers",
    menu: [
      {
        title: "Github",
        path: "https://github.com/gnoswap-labs/gnoswap",
        newTab: true,
      },
      {
        title: "Docs",
        path: "https://docs.gnoswap.io/",
        newTab: true,
      },
      {
        title: "Audit",
        path: "/",
        newTab: true,
      },
      {
        title: "Bug Bounty",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "Governance",
    menu: [
      {
        title: "Forum",
        path: "/",
        newTab: true,
      },
      {
        title: "Proposals",
        path: "/",
        newTab: true,
      },
      {
        title: "Vote",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "Policy",
    menu: [
      {
        title: "Terms of Use",
        path: "gnoswap.io/terms-of-use",
        newTab: true,
      },
      {
        title: "Privacy Policy",
        path: "gnoswap.io/privacy-policy",
        newTab: true,
      },
    ],
  },
];
