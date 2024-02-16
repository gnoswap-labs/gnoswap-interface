import { SIDE_MENU_NAV } from "@constants/header.constant";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import {
  Navigation,
  HeaderSideMenuModalWrapper,
  LinkIconButton,
  LeftIconMenu,
  RightIconMenu,
  LeftIcon,
  MenuDivider,
} from "./HeaderSideMenuModal.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconAccountUser from "../icons/IconAccountUser";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface HeaderSideMenuModalProps {
  onSideMenuToggle: () => void;
}

const HeaderSideMenuModal: React.FC<HeaderSideMenuModalProps> = ({
  onSideMenuToggle,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

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

  return (
    <HeaderSideMenuModalWrapper ref={menuRef}>
      <Navigation>
        <ul>
          <li onClick={() => router.push(SIDE_MENU_NAV.GOVERNENCE.path)}>
            <Link href={SIDE_MENU_NAV.GOVERNENCE.path}>
              <LeftIconMenu>
                <LeftIcon>
                  <IconAccountUser className="left-icon" />
                </LeftIcon>
                {t(SIDE_MENU_NAV.GOVERNENCE.title)}
              </LeftIconMenu>
            </Link>
          </li>
        </ul>
        <MenuDivider />
        <ul>
          <li onClick={() => router.push(SIDE_MENU_NAV.HELPCENTER.path)}>
            <Link href={SIDE_MENU_NAV.HELPCENTER.path}>
              <RightIconMenu>
                {t(SIDE_MENU_NAV.HELPCENTER.title)}
                <LinkIconButton >
                  <IconOpenLink className="right-icon" />
                </LinkIconButton>
              </RightIconMenu>
            </Link>
          </li>
          <li onClick={() => router.push(SIDE_MENU_NAV.DOCUMENTATION.path)}>
            <Link href={SIDE_MENU_NAV.DOCUMENTATION.path}>
              <RightIconMenu>
                {t(SIDE_MENU_NAV.DOCUMENTATION.title)}
                <LinkIconButton>
                  <IconOpenLink className="right-icon" />
                </LinkIconButton>
              </RightIconMenu>
            </Link>
          </li>
          <li className="last-side-menu" onClick={() => router.push(SIDE_MENU_NAV.LEGALPRIVACY.path)}>
            <Link href={SIDE_MENU_NAV.LEGALPRIVACY.path}>
              <RightIconMenu>
                {t(SIDE_MENU_NAV.LEGALPRIVACY.title)}
                <LinkIconButton>
                  <IconOpenLink className="right-icon" />
                </LinkIconButton>
              </RightIconMenu>
            </Link>
          </li>
        </ul>
      </Navigation>
    </HeaderSideMenuModalWrapper>
  );
};

export default HeaderSideMenuModal;
