import React from "react";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";
import IconArrowUp from "../icons/IconArrowUp";
import IconArrowDown from "../icons/IconArrowDown";
import { useTheme } from "@emotion/react";

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
      onBlur={() => onSideMenuToggle(false)}
      className={`${sideMenuToggle ? "selected" : ""}`}
    >
      {sideMenuToggle ? <IconArrowUp fill={theme.color.text04} /> : <IconArrowDown fill={theme.color.text04} />}
      {sideMenuToggle && (
        <HeaderSideMenuModal onSideMenuToggle={() => onSideMenuToggle(false)} />
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
