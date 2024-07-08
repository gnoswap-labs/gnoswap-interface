import React from "react";
import IconFooterDarkLogo from "../icons/IconFooterDarkLogo";
import IconFooterLightLogo from "../icons/IconFooterLightLogo";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import Link from "next/link";
import {
  FooterWrapper,
  FooterContainer,
  FirstSection,
  MenuSection,
  SecondSection,
  SocialNav,
  AnchorStyle,
} from "./Footer.styles";
import { FOOTER_LEFT_NAV, FOOTER_RIGHT_NAV } from "@constants/footer.constant";
import { useTranslation } from "next-i18next";

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
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { t } = useTranslation("HeaderFooter");

  return (
    <FooterWrapper>
      <FooterContainer>
        <FirstSection>
          {themeKey === "dark" ? (
            <IconFooterDarkLogo className="footer-main-logo" />
          ) : (
            <IconFooterLightLogo className="footer-main-logo" />
          )}
          <p className="footer-content">{t(FOOTER_LEFT_NAV.content)}</p>
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
        </FirstSection>
        <SecondSection>
          {FOOTER_RIGHT_NAV.map(list => (
            <MenuSection key={list.content}>
              <strong>{t(list.content)}</strong>
              {list.menu.map((menu: any) => (
                <Anchor
                  path={menu.path}
                  title={t(menu.title)}
                  newTab={menu.newTab}
                  key={menu.title}
                  className="list-menu"
                />
              ))}
            </MenuSection>
          ))}
        </SecondSection>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
