import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo, useRef } from "react";

import IconAccountUser from "@components/common/icons/IconAccountUser";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconPulse from "@components/common/icons/IconPulse";
import { BLOCKED_PAGES } from "@constants/environment.constant";
import { SIDE_EXTRA_MENU_NAV, SIDE_MENU_NAV } from "@constants/header.constant";
import useCustomRouter from "@hooks/common/use-custom-router";

import {
  LeftIcon,
  LeftIconMenu,
  LinkIconButton,
  MenuDivider,
  Navigation,
  RightIconMenu,
  SubMenuWrapper,
} from "./SubMenu.styles";

import Link from "next/link";
import IconLeaderboard from "@components/common/icons/IconLeaderboard";
import IconLaunchpad from "@components/common/icons/IconLaunchpad";
import { TABLET_HIDDEN_NAV_PATHS } from "@constants/page.constant";

interface HeaderSideMenuModalProps {
  isCollapseNav: boolean;
  onSideMenuToggle: () => void;
  onNavigation: (e: React.MouseEvent) => void;
  getNavigationPath: (path: string) => string;
}

const SubMenu: React.FC<HeaderSideMenuModalProps> = ({
  isCollapseNav,
  onSideMenuToggle,
  onNavigation,
  getNavigationPath,
}) => {
  const router = useCustomRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  // Todo: A menu may be added.
  const navigationItems = useMemo(() => {
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);

    if (!isCollapseNav) {
      return [];
    }

    return SIDE_MENU_NAV.filter(
      item => !blockedPaths.includes(item.path) && TABLET_HIDDEN_NAV_PATHS.includes(item.path),
    );
  }, [isCollapseNav]);

  const extraNavigationItems = useMemo(() => {
    // Make path by page name
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);
    return SIDE_EXTRA_MENU_NAV.filter(item => !blockedPaths.includes(item.path));
  }, []);

  const getIcon = useCallback((iconType: string | null) => {
    switch (iconType) {
      case "PULSE":
        return <IconPulse className="left-icon" />;
      case "ACCOUNT_USER":
        return <IconAccountUser className="left-icon" />;
      case "LEADERBOARD":
        return <IconLeaderboard className="left-icon" />;
      case "LAUNCHPAD":
        return <IconLaunchpad className="left-icon launchpad" />;
      case "OPEN_LINK":
        return <IconOpenLink className="right-icon" />;
      default:
        return null;
    }
  }, []);

  return (
    <SubMenuWrapper ref={menuRef} id="sub-item">
      <Navigation>
        <ul>
          {/* // Todo: A menu may be added. */}
          {navigationItems.length > 0 && (
            <>
              {navigationItems.map((item, index) => (
                <Link href={getNavigationPath(item.path)} key={index} onClick={onNavigation}>
                  <li
                    className="header-side-menu-item"
                    onClick={() => {
                      onSideMenuToggle();
                    }}
                  >
                    <div>
                      <LeftIconMenu>
                        <LeftIcon>{getIcon(item.iconType)}</LeftIcon>
                        {t(item.title)}
                      </LeftIconMenu>
                    </div>
                  </li>
                </Link>
              ))}
              <MenuDivider />
            </>
          )}
          {extraNavigationItems.map((item, index) => (
            <li
              key={index}
              className="header-side-menu-item"
              onClick={() => {
                if (item.path.startsWith("/")) router.push(item.path);
                else window.open(item.path);
                onSideMenuToggle();
              }}
            >
              <div>
                <RightIconMenu>
                  {t(item.title)}
                  <LinkIconButton>{getIcon(item.iconType)}</LinkIconButton>
                </RightIconMenu>
              </div>
            </li>
          ))}
        </ul>
      </Navigation>
    </SubMenuWrapper>
  );
};

export default SubMenu;
