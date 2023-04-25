import React from "react";
import IconLogoWhite from "../icons/IconLogoWhite";
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
import { FOOTER_LEFT_NAV, FOOTER_RIGHT_NAV } from "@constants/footer.constant";

type AnchorProps = {
  path: string;
  title?: string;
  icon?: React.ReactNode;
  newTab?: boolean;
  className?: string;
};

function Anchor({ path, title, icon, newTab = false, className }: AnchorProps) {
  return (
    <>
      {newTab ? (
        <AnchorStyle
          href={path}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {title ?? icon}
        </AnchorStyle>
      ) : (
        <Link href={path} passHref legacyBehavior>
          <AnchorStyle className={className}>{title ?? icon}</AnchorStyle>
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
          <p className="footer-content">{FOOTER_LEFT_NAV.content}</p>
          <SocialNav>
            {FOOTER_LEFT_NAV.menu.map(item => (
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
          {FOOTER_RIGHT_NAV.map(list => (
            <MenuSection key={list.content}>
              <strong>{list.content}</strong>
              {list.menu.map((menu: any) => (
                <Anchor
                  path={menu.path}
                  title={menu.title}
                  newTab={menu.newTab}
                  key={menu.title}
                  className="list-menu"
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
