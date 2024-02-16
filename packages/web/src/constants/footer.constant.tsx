import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconTelegram from "@components/common/icons/social/IconTelegram";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";

export const FOOTER_LEFT_NAV = {
  content:
    "HeaderFooter:joinGnoswap",
  contentSecond: "HeaderFooter:theFastest",
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
        title: "HeaderFooter:swap",
        path: "/swap",
        newTab: false,
      },
      {
        title: "HeaderFooter:addPosi",
        path: "/earn/add",
        newTab: false,
      },
      {
        title: "HeaderFooter:stakePosi",
        path: "/earn/pool/gno.land_r_demo_gns:gno.land_r_demo_wugnot:3000",
        newTab: false,
      },
      {
        title: "HeaderFooter:incenti",
        path: "/earn/incentivize",
        newTab: false,
      },
    ],
  },
  {
    content: "HeaderFooter:help",
    menu: [
      {
        title: "HeaderFooter:about",
        path: "https://docs.gnoswap.io/welcome",
        newTab: true,
      },
      {
        title: "FAQ",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:Twitter",
        path: "https://twitter.com/gnoswaplabs",
        newTab: true,
      },
      {
        title: "HeaderFooter:projectOnboarding",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:Developers",
    menu: [
      {
        title: "HeaderFooter:github",
        path: "https://github.com/gnoswap-labs/gnoswap",
        newTab: true,
      },
      {
        title: "HeaderFooter:docs",
        path: "https://docs.gnoswap.io/contracts/",
        newTab: true,
      },
      {
        title: "HeaderFooter:audit",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:bug",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:governance",
    menu: [
      {
        title: "HeaderFooter:forum",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:proposals",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:vote",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:policy",
    menu: [
      {
        title: "HeaderFooter:terms",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:privacy",
        path: "/",
        newTab: true,
      },
    ],
  },
];
