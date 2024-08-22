import { useTranslation } from "next-i18next";
import React, { Fragment, useCallback, useMemo, useRef } from "react";

import IconAccountUser from "@components/common/icons/IconAccountUser";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconPulse from "@components/common/icons/IconPulse";
import { BLOCKED_PAGES } from "@constants/environment.constant";
import {
  HEADER_NAV,
  SIDE_EXTRA_MENU_NAV,
  SIDE_MENU_NAV,
} from "@constants/header.constant";
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

interface HeaderSideMenuModalProps {
  onSideMenuToggle: () => void;
}

const SubMenu: React.FC<HeaderSideMenuModalProps> = ({
  onSideMenuToggle,
}) => {
  const router = useCustomRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

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
    <SubMenuWrapper ref={menuRef} id="sub-item">
      <Navigation>
        {navigationItems.length > 0 && (
          <React.Fragment>
            <ul>
              {navigationItems.map((item, index) => (
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
                    <LeftIconMenu>
                      <LeftIcon>{getIcon(item.iconType)}</LeftIcon>
                      {t(item.title)}
                    </LeftIconMenu>
                  </div>
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