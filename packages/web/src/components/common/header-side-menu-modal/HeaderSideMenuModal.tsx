import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  HEADER_NAV,
  SIDE_EXTRA_MENU_NAV,
  SIDE_MENU_NAV,
} from "@constants/header.constant";
import {
  Navigation,
  HeaderSideMenuModalWrapper,
  LeftIconMenu,
  LeftIcon,
  MenuDivider,
  RightIconMenu,
  LinkIconButton,
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
    const allPaths = [...HEADER_NAV, ...SIDE_MENU_NAV].filter(
      item => !blockedPaths.includes(item.path),
    );
    if (allPaths.length > 4) {
      return allPaths.slice(4, allPaths.length - 1);
    }
    return [];
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

  const getIcon = useCallback((iconType: string | null) => {
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
        {navigationItems.length > 0 && (
          <React.Fragment>
            <ul>
              {navigationItems.map((item, index) => (
                <li
                  key={index}
                  className="header-side-menu-item"
                  onClick={() => router.push(item.path)}
                >
                  <a>
                    <LeftIconMenu>
                      <LeftIcon>{getIcon(item.iconType)}</LeftIcon>
                      {item.title}
                    </LeftIconMenu>
                  </a>
                </li>
              ))}
            </ul>
            <MenuDivider />
          </React.Fragment>
        )}
        <ul>
          {extraNavigationItems.map((item, index) => (
            <li
              key={index}
              className="header-side-menu-item"
              onClick={() => router.push(item.path)}
            >
              <a>
                <RightIconMenu>
                  {item.title}
                  <LinkIconButton>{getIcon(item.iconType)}</LinkIconButton>
                </RightIconMenu>
              </a>
            </li>
          ))}
        </ul>
      </Navigation>
    </HeaderSideMenuModalWrapper>
  );
};

export default HeaderSideMenuModal;
