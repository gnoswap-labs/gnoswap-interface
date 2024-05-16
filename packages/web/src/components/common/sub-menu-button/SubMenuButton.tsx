import React from "react";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";
import { useTheme } from "@emotion/react";
import { FakeSpaceWrapper } from "../header-side-menu-modal/HeaderSideMenuModal.styles";
import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "../icons/IconStrokeArrowUp";

interface SubMenuButtonProps {
  sideMenuToggle: boolean;
  onSideMenuToggle: (value: boolean) => void;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  sideMenuToggle,
  onSideMenuToggle,
}) => {
  const theme = useTheme();

  return (
    <SubMenuButtonWrapper
      onMouseEnter={() => onSideMenuToggle(true)}
      onMouseLeave={() => onSideMenuToggle(false)}
      className={`${sideMenuToggle ? "selected" : ""}`}
    >
      {sideMenuToggle
        ? <IconStrokeArrowUp className="popup-icon-button" svgProps={{ fill: theme.color.text16 }} />
        : <IconStrokeArrowDown className="popup-icon-button" svgProps={{ fill: theme.color.text04 }} />}
      {true && (
        <>
          <FakeSpaceWrapper></FakeSpaceWrapper>
          <HeaderSideMenuModal onSideMenuToggle={() => onSideMenuToggle(false)} />
        </>
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
