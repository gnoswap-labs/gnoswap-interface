import IconDiscord from "@components/common/icons/social/IconDiscord";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconGithub from "@components/common/icons/social/IconGithub";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconX from "@components/common/icons/social/IconX";

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
      icon: <IconX />,
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
        path: "/earn/pool/stake",
        newTab: false,
      },
      {
        title: "HeaderFooter:featuresSection.item.incentivizePool",
        path: "/earn/incentivize",
        newTab: false,
      },
      {
        title: "HeaderFooter:featuresSection.item.launchpad",
        path: "/launchpad",
        newTab: false,
      },
    ],
  },
  {
    content: "HeaderFooter:governanceSection.title",
    menu: [
      {
        title: "HeaderFooter:governanceSection.item.xgns",
        path: EXT_URL.DOCS.XGNS,
        newTab: true,
      },
      {
        title: "HeaderFooter:governanceSection.item.proposals",
        path: "/governance#proposal-list",
        newTab: false,
      },
      {
        title: "HeaderFooter:governanceSection.item.forum",
        path: EXT_URL.SOCIAL.DISCORD,
        newTab: true,
      },
      {
        title: "HeaderFooter:governanceSection.item.dashboard",
        path: "/explore",
        newTab: false,
      },
    ],
  },
  {
    content: "HeaderFooter:helpSection.title",
    menu: [
      {
        title: "HeaderFooter:helpSection.item.aboutUs",
        path: EXT_URL.DOCS.ROOT,
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.userGuide",
        path: EXT_URL.DOCS.USER_GUIDE.ROOT,
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.projectOnboarding",
        path: EXT_URL.DOCS.ONBOARDING,
        newTab: true,
      },
      {
        title: "HeaderFooter:helpSection.item.faq",
        path: EXT_URL.DOCS.FAQ,
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
        path: EXT_URL.AUDIT,
        newTab: true,
      },
      {
        title: "HeaderFooter:developersSection.item.bugBounty",
        path: EXT_URL.GITHUB.CONTRACTS,
        newTab: true,
      },
    ],
  },
  {
    content: "HeaderFooter:policySection.title",
    menu: [
      {
        title: "HeaderFooter:policySection.item.terms",
        path: "/terms",
        newTab: true,
      },
      {
        title: "HeaderFooter:policySection.item.privacyPolicy",
        path: "/privacy",
        newTab: true,
      },
      {
        title: "HeaderFooter:policySection.item.disclaimer",
        path: EXT_URL.DOCS.DISCLAIMER,
        newTab: true,
      },
      {
        title: "HeaderFooter:policySection.item.risk",
        path: EXT_URL.DOCS.RISK,
        newTab: true,
      },
    ],
  },
];
