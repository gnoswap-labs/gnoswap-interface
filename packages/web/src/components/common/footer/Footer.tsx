import React from "react";
import IconLogoWhite from "../icons/IconLogoWhite";
import IconGithub from "../icons/social/IconGithub";
import IconGitbook from "../icons/social/IconGitbook";
import IconDiscode from "../icons/social/IconDiscode";
import IconMedium from "../icons/social/IconMedium";
import IconTwitter from "../icons/social/IconTwitter";
import Link from "next/link";
import {
  AnchorStyle,
  FooterInner,
  FooterWrapper,
  LeftSection,
  MenuSection,
  RightSection,
  SocialNav,
} from "./Footer.styles";

type AnchorProps = {
  path: string;
  title?: string;
  icon?: React.ReactNode;
  newTab?: boolean;
};

const footerLeftNav = {
  content:
    "Gnoswap is an open-source &\naudited AMM Dex that provides\na simplified concentrated-LP\nexperience for increased capital\nefficiency.",
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

const footerRightNav = [
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

function Anchor({ path, title, icon, newTab = false }: AnchorProps) {
  return (
    <>
      {newTab ? (
        <AnchorStyle href={path} target="_blank" rel="noreferrer">
          {title ?? icon}
        </AnchorStyle>
      ) : (
        <Link href={path} passHref legacyBehavior>
          <AnchorStyle>{title ?? icon}</AnchorStyle>
        </Link>
      )}
    </>
  );
}

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterInner>
        <LeftSection>
          <IconLogoWhite className="footer-logo" />
          <p className="footer-content">{footerLeftNav.content}</p>
          <SocialNav>
            {footerLeftNav.menu.map(item => (
              <Anchor
                path={item.path}
                icon={item.icon}
                key={item.title}
                newTab={true}
              />
            ))}
          </SocialNav>
        </LeftSection>
        <RightSection>
          {footerRightNav.map((list, idx) => (
            <MenuSection key={list.content}>
              <strong>{list.content}</strong>
              {list.menu.map((menu: any) => (
                <Anchor
                  path={menu.path}
                  title={menu.title}
                  newTab={menu.newTab}
                  key={menu.title}
                />
              ))}
            </MenuSection>
          ))}
        </RightSection>
      </FooterInner>
    </FooterWrapper>
  );
};

export default Footer;
