import React from "react";
import IconLogoPrimary from "../icons/IconLogoPrimary";
import Link from "next/link";
import {
  HeaderInner,
  HeaderWrapper,
  LogoLink,
  Navigation,
  RightSection,
} from "./Header.styles";
import NotificationButton from "../notificationButton/NotificationButton";
import { HEADER_NAV } from "@constants/header.constant";
import WalletConnector from "../walletConnector/WalletConnector";

interface HeaderProps {
  pathname?: string;
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ pathname = "/", isConnected }) => {
  return (
    <HeaderWrapper>
      <HeaderInner>
        <Link href="/" passHref legacyBehavior>
          <LogoLink>
            <IconLogoPrimary />
          </LogoLink>
        </Link>
        <Navigation>
          <ul>
            {HEADER_NAV.map(item => (
              <li
                key={item.title}
                className={pathname === item.path ? "selected" : ""}
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </Navigation>
        <RightSection>
          <WalletConnector isConnected={isConnected} />
          <NotificationButton />
        </RightSection>
      </HeaderInner>
    </HeaderWrapper>
  );
};

export default Header;
