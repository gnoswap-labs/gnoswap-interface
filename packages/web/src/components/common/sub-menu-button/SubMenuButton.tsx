import React from "react";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";
import IconArrowUp from "../icons/IconArrowUp";
import IconArrowDown from "../icons/IconArrowDown";
import { useTheme } from "@emotion/react";
import { FakeSpaceWrapper } from "../header-side-menu-modal/HeaderSideMenuModal.styles";

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
      {sideMenuToggle ? <IconArrowUp fill={theme.color.text16} /> : <IconArrowDown fill={theme.color.text04} />}
      {sideMenuToggle && (
        <>
          <FakeSpaceWrapper></FakeSpaceWrapper>
          <HeaderSideMenuModal onSideMenuToggle={() => onSideMenuToggle(false)} />
        </>
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
