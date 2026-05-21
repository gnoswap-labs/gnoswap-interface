import { useTheme } from "@emotion/react";
import React, { useEffect, useRef } from "react";

import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";

import SubMenu from "./sub-menu/SubMenu";

import { FakeSpaceWrapper } from "./sub-menu/SubMenu.styles";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";

interface SubMenuButtonProps {
  sideMenuToggle: boolean;
  isCollapseNav: boolean;
  onSideMenuToggle: (value: boolean) => void;
  onNavigation: (e: React.MouseEvent) => void;
  getNavigationPath: (path: string) => string;
  isBottomNav: boolean;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  sideMenuToggle,
  isCollapseNav,
  onSideMenuToggle,
  onNavigation,
  getNavigationPath,
  isBottomNav,
}) => {
  const theme = useTheme();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    const mouseEventHandler = (e: MouseEvent) => {
      const rect = buttonRef.current?.getBoundingClientRect();
      const menu = document.getElementById("sub-item");
      const menuRect = menu?.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (
        (rect && mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom + 10) ||
        (menuRect &&
          mouseX >= menuRect.left &&
          mouseX <= menuRect.right &&
          mouseY >= menuRect.top &&
          mouseY <= menuRect.bottom)
      ) {
        onSideMenuToggle(true);
      } else {
        onSideMenuToggle(false);
      }
    };

    if (element) document.addEventListener("mousemove", mouseEventHandler);

    return () => {
      if (element) document.removeEventListener("mouseover", mouseEventHandler);
    };
  }, []);

  const ArrowIcon = isBottomNav
    ? sideMenuToggle
      ? IconStrokeArrowDown
      : IconStrokeArrowUp
    : sideMenuToggle
      ? IconStrokeArrowUp
      : IconStrokeArrowDown;

  return (
    <SubMenuButtonWrapper ref={buttonRef} className={`${sideMenuToggle ? "selected" : ""}`}>
      <ArrowIcon
        className="popup-icon-button"
        svgProps={{ fill: sideMenuToggle ? theme.color.text16 : theme.color.text04 }}
      />
      {sideMenuToggle && (
        <>
          <FakeSpaceWrapper></FakeSpaceWrapper>
          <SubMenu
            onNavigation={onNavigation}
            getNavigationPath={getNavigationPath}
            isCollapseNav={isCollapseNav}
            onSideMenuToggle={() => onSideMenuToggle(false)}
          />
        </>
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
