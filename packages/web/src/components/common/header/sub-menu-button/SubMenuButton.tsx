import { useTheme } from "@emotion/react";
import React, { useEffect, useRef } from "react";

import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";

import SubMenu from "./sub-menu/SubMenu";

import { FakeSpaceWrapper } from "./sub-menu/SubMenu.styles";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";

interface SubMenuButtonProps {
  sideMenuToggle: boolean;
  onSideMenuToggle: (value: boolean) => void;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  sideMenuToggle,
  onSideMenuToggle,
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
        (rect &&
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom + 10) ||
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


  return (
    <SubMenuButtonWrapper
      ref={buttonRef}
      className={`${sideMenuToggle ? "selected" : ""}`}
    >
      {sideMenuToggle ? (
        <IconStrokeArrowUp
          className="popup-icon-button"
          svgProps={{ fill: theme.color.text16 }}
        />
      ) : (
        <IconStrokeArrowDown
          className="popup-icon-button"
          svgProps={{ fill: theme.color.text04 }}
        />
      )}
      {sideMenuToggle && (
        <>
          <FakeSpaceWrapper></FakeSpaceWrapper>
          <SubMenu
            onSideMenuToggle={() => onSideMenuToggle(false)}
          />
        </>
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
