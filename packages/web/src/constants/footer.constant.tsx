import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconDiscode from "@components/common/icons/social/IconDiscode";
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
      path: "docs.gnoswap.io",
    },
    {
      title: "discode",
      icon: <IconDiscode />,
      path: "/",
    },
    {
      title: "medium",
      icon: <IconMedium />,
      path: "/",
    },
    {
      title: "twitter",
      icon: <IconTwitter />,
      path: "/",
    },
  ],
};

export const FOOTER_RIGHT_NAV = [
  {
    content: "Services",
    menu: [
      {
        title: "Swap",
        path: "/swap",
        newTab: false,
      },
      {
        title: "Earn",
        path: "/earn",
        newTab: false,
      },
      {
        title: "Wallet",
        path: "/wallet",
        newTab: false,
      },
      {
        title: "Dashboard",
        path: "/dashboard",
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
        title: "Discord Support",
        path: "/",
        newTab: true,
      },
      {
        title: "Twitter Support",
        path: "/",
        newTab: true,
      },
      {
        title: "Forum Support",
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
        title: "GitBook",
        path: "docs.gnoswap.io",
        newTab: true,
      },
      {
        title: "Development",
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
