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
import IconShoppingBag from "../icons/IconShoppingBag";

interface HeaderSideMenuModalProps {
  onSideMenuToggle: () => void;
}

const HeaderSideMenuModal: React.FC<HeaderSideMenuModalProps> = ({
  onSideMenuToggle,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

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
          <li>
            <Link href={SIDE_MENU_NAV.GOVERNENCE.path}>
              <LeftIconMenu>
                <LeftIcon onClick={() => {}}>
                  <IconAccountUser className="left-icon" />
                </LeftIcon>
                {SIDE_MENU_NAV.GOVERNENCE.title}
              </LeftIconMenu>
            </Link>
          </li>
          <li>
            <Link href={SIDE_MENU_NAV.AIRDROP.path}>
              <LeftIconMenu>
                <LeftIcon onClick={() => {}}>
                  <IconShoppingBag className="left-icon" />
                </LeftIcon>
                {SIDE_MENU_NAV.AIRDROP.title}
              </LeftIconMenu>
            </Link>
          </li>
        </ul>
        <MenuDivider />
        <ul>
          <li>
            <Link href={SIDE_MENU_NAV.HELPCENTER.path}>
              <RightIconMenu>
                {SIDE_MENU_NAV.HELPCENTER.title}
                <LinkIconButton onClick={() => {}}>
                  <IconOpenLink className="right-icon" />
                </LinkIconButton>
              </RightIconMenu>
            </Link>
          </li>
          <li>
            <Link href={SIDE_MENU_NAV.DOCUMENTATION.path}>
              <RightIconMenu>
                {SIDE_MENU_NAV.DOCUMENTATION.title}
                <LinkIconButton onClick={() => {}}>
                  <IconOpenLink className="right-icon" />
                </LinkIconButton>
              </RightIconMenu>
            </Link>
          </li>
          <li>
            <Link href={SIDE_MENU_NAV.LEGALPRIVACY.path}>
              <RightIconMenu>
                {SIDE_MENU_NAV.LEGALPRIVACY.title}
                <LinkIconButton onClick={() => {}}>
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
