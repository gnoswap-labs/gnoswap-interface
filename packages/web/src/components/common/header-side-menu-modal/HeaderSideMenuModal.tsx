import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { SIDE_EXTRA_MENU_NAV, SIDE_MENU_NAV } from "@constants/header.constant";
import {
  Navigation,
  HeaderSideMenuModalWrapper,
  LeftIconMenu,
  LeftIcon,
  MenuDivider,
} from "./HeaderSideMenuModal.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconAccountUser from "../icons/IconAccountUser";
import IconPulse from "../icons/IconPulse";
import { BLOCKED_PAGES } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";

interface HeaderSideMenuModalProps {
  onSideMenuToggle: () => void;
}

const HeaderSideMenuModal: React.FC<HeaderSideMenuModalProps> = ({
  onSideMenuToggle,
}) => {
  const router = useCustomRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigationItems = useMemo(() => {
    // Make path by page name
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);
    return SIDE_MENU_NAV.filter(item => !blockedPaths.includes(item.path));
  }, []);

  const extraNavigationItems = useMemo(() => {
    // Make path by page name
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);
    return SIDE_EXTRA_MENU_NAV.filter(
      item => !blockedPaths.includes(item.path),
    );
  }, []);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onSideMenuToggle();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [menuRef, onSideMenuToggle]);

  const getLeftIcon = useCallback((iconType: string) => {
    switch (iconType) {
      case "PULSE":
        return <IconPulse className="left-icon" />;
      case "ACCOUNT_USER":
        return <IconAccountUser className="left-icon" />;
      case "OPEN_LINK":
        return <IconOpenLink className="right-icon" />;
      default:
        return <Fragment />;
    }
  }, []);

  return (
    <HeaderSideMenuModalWrapper ref={menuRef}>
      <Navigation>
        <ul>
          {navigationItems.map((item, index) => (
            <li key={index}>
              <span onClick={() => router.push(item.path)}>
                <LeftIconMenu>
                  <LeftIcon>{getLeftIcon(item.iconType)}</LeftIcon>
                  {item.title}
                </LeftIconMenu>
              </span>
            </li>
          ))}
        </ul>
        <MenuDivider />
        <ul>
          {extraNavigationItems.map((item, index) => (
            <li key={index}>
              <span onClick={() => router.push(item.path)}>
                <LeftIconMenu>
                  <LeftIcon>{getLeftIcon(item.iconType)}</LeftIcon>
                  {item.title}
                </LeftIconMenu>
              </span>
            </li>
          ))}
        </ul>
      </Navigation>
    </HeaderSideMenuModalWrapper>
  );
};

export default HeaderSideMenuModal;
