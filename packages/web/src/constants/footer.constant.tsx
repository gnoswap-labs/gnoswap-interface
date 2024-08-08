import IconGithub from "@components/common/icons/social/IconGithub";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";
import IconDiscord from "@components/common/icons/social/IconDiscord";

import { DEFAULT_POOL_PATH } from "./common.constant";
import { EXT_URL } from "./external-url.contant";

export const FOOTER_LEFT_NAV = {
  content: "HeaderFooter:introduction",
  menu: [
    {
      title: "github",
      icon: <IconGithub />,
      path: EXT_URL.GITHUB.CONTRACTS,
    },
    {
      title: "gitbook",
      icon: <IconGitbook />,
      path: EXT_URL.DOCS.ROOT,
    },
    {
      title: "discord",
      icon: <IconDiscord />,
      path: EXT_URL.SOCIAL.DISCORD,
    },
    {
      title: "medium",
      icon: <IconMedium />,
      path: EXT_URL.SOCIAL.MEDIUM,
    },
    {
      title: "twitter",
      icon: <IconTwitter />,
      path: EXT_URL.SOCIAL.TWITTER,
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
        path: `/earn/pool?poolPath=${DEFAULT_POOL_PATH}#staking`,
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
        path: EXT_URL.DOCS.WELCOME,
        newTab: true,
      },
      {
        title: "FAQ",
        path: "/",
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.twitter",
        path: EXT_URL.SOCIAL.TWITTER,
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.projectOnboarding",
        path: EXT_URL.DOCS.ONBOARDING,
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:developersSection.title",
    menu: [
      {
        title: "HeaderFooter:developersSection.item.github",
        path: EXT_URL.GITHUB.CONTRACTS,
        newTab: true,
      },
      {
        title: "HeaderFooter:developersSection.item.docs",
        path: EXT_URL.DOCS.CONTRACTS,
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
