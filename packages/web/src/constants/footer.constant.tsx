import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";
import IconDiscord from "@components/common/icons/social/IconDiscord";

export const FOOTER_LEFT_NAV = {
  content: "HeaderFooter:joinGnoswap",
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
      title: "discord",
      icon: <IconDiscord />,
      path: "https://discord.gg/u4bdGHStb2",
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
        title: "Stake Position",
        path: "/earn/pool/gno.land_r_demo_wugnot:gno.land_r_gnoswap_gns:3000#staking",
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
