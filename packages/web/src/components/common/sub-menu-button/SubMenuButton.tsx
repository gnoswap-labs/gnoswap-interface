import React from "react";
import { SubMenuButtonWrapper } from "./SubMenuButton.styles";
import HeaderSideMenuModal from "../header-side-menu-modal/HeaderSideMenuModal";

interface SubMenuButtonProps {
  sideMenuToggle: boolean;
  onSideMenuToggle: () => void;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  sideMenuToggle,
  onSideMenuToggle,
}) => {
  return (
    <SubMenuButtonWrapper
      onClick={onSideMenuToggle}
      className={`${sideMenuToggle ? "selected" : ""}`}
    >
      ···
      {sideMenuToggle && (
        <HeaderSideMenuModal onSideMenuToggle={onSideMenuToggle} />
      )}
    </SubMenuButtonWrapper>
  );
};

export default SubMenuButton;
