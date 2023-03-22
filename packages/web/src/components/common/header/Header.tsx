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
import NotificationButton from "@components/common/notification-button/NotificationButton";
import { HEADER_NAV } from "@constants/header.constant";
import WalletConnectorButton from "@components/common/wallet-connector-button/WalletConnectorButton";

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
          <WalletConnectorButton isConnected={isConnected} />
          <NotificationButton />
        </RightSection>
      </HeaderInner>
    </HeaderWrapper>
  );
};

export default Header;
