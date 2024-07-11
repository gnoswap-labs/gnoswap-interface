import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";
import IconDiscord from "@components/common/icons/social/IconDiscord";

export const FOOTER_LEFT_NAV = {
  content: "HeaderFooter:introduction",
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
    content: "HeaderFooter:featuresSection.title",
    menu: [
      {
        title: "HeaderFooter:featuresSection.item.swap",
        path: "/swap",
        newTab: false,
      },
      {
        title: "HeaderFooter:featuresSection.item.addPosition",
        path: "/earn/add",
        newTab: false,
      },
      {
        title: "HeaderFooter:featuresSection.item.stakePosition",
        path: "/earn/pool/gno.land_r_demo_wugnot:gno.land_r_gnoswap_gns:3000#staking",
        newTab: false,
      },
      {
        title: "HeaderFooter:featuresSection.item.incentivizePool",
        path: "/earn/incentivize",
        newTab: false,
      },
    ],
  },
  {
    content: "HeaderFooter:helpSection.title",
    menu: [
      {
        title: "HeaderFooter:helpSection.item.aboutUs",
        path: "https://docs.gnoswap.io/welcome",
        newTab: true,
      },
      {
        title: "FAQ",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.twitter",
        path: "https://twitter.com/gnoswaplabs",
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.projectOnboarding",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:developersSection.title",
    menu: [
      {
        title: "HeaderFooter:developersSection.item.github",
        path: "https://github.com/gnoswap-labs/gnoswap",
        newTab: true,
      },
      {
        title: "HeaderFooter:developersSection.item.docs",
        path: "https://docs.gnoswap.io/contracts/",
        newTab: true,
      },
      {
        title: "HeaderFooter:developersSection.item.audit",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:developersSection.item.bugBounty",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:governanceSection.title",
    menu: [
      {
        title: "HeaderFooter:governanceSection.item.forum",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:governanceSection.item.proposals",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:governanceSection.item.vote",
        path: "/",
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:policySection.title",
    menu: [
      {
        title: "HeaderFooter:policySection.item.terms",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:policySection.item.privacyPolicy",
        path: "/",
        newTab: true,
      },
    ],
  },
];
