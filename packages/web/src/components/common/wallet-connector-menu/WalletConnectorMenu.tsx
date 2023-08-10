import React, { useEffect, useRef } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconCopy from "@components/common/icons/IconCopy";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconExit from "@components/common/icons/IconExit";
import {
  AmountInfoBox,
  IconButton,
  MenuHeader,
  ThemeSelector,
  WalletConnectorMenuWrapper,
} from "./WalletConnectorMenu.styles";
import { toGnot } from "@utils/number-utils";
import { formatAddress } from "@utils/string-utils";
import ThemeModeContainer from "@containers/theme-mode-container/ThemeModeContainer";

const FAKE_USERINFO = {
  status: "ACTIVE",
  address: "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt",
  amount: {
    value: 1005.878295,
    denom: "gnot",
  },
};

interface IconButtonClickProps {
  copyClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  openLinkClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  exitClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButtonMaker: React.FC<IconButtonClickProps> = ({
  copyClick,
  openLinkClick,
  exitClick,
}) => {
  return (
    <>
      <IconButton onClick={copyClick}>
        <IconCopy className="action-icon" />
      </IconButton>
      <IconButton onClick={openLinkClick}>
        <IconOpenLink className="action-icon" />
      </IconButton>
      <IconButton onClick={exitClick}>
        <IconExit className="action-icon" />
      </IconButton>
    </>
  );
};

interface WalletConnectorMenuProps {
  isConnected: boolean;
  onMenuToggle: () => void;
}

const WalletConnectorMenu: React.FC<WalletConnectorMenuProps> = ({
  isConnected,
  onMenuToggle,
}) => {
  const amountText = toGnot(
    FAKE_USERINFO.amount.value,
    FAKE_USERINFO.amount.denom,
  );
  const copyClick = () => {};
  const openLinkClick = () => {};
  const exitClick = () => {};
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onMenuToggle();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [menuRef, onMenuToggle]);

  return (
    <WalletConnectorMenuWrapper ref={menuRef}>
      {isConnected ? (
        <div className="button-container">
          <MenuHeader>
            <IconAdenaLogo />
            <span className="user-address">
              {formatAddress(FAKE_USERINFO.address)}
            </span>
            <IconButtonMaker
              copyClick={copyClick}
              openLinkClick={openLinkClick}
              exitClick={exitClick}
            />
          </MenuHeader>
          <AmountInfoBox>{`${amountText.value} ${amountText.denom}`}</AmountInfoBox>
        </div>
      ) : (
        <div className="button-container">
          <Button
            text="Connect Wallet"
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fontType: "body9",
              fullWidth: true,
              height: 41,
              justify: "center",
            }}
          />
        </div>
      )}
      <div className="theme-container">
        <ThemeSelector>
          <span>Theme</span>
          <ThemeModeContainer />
        </ThemeSelector>
      </div>
    </WalletConnectorMenuWrapper>
  );
};

export default WalletConnectorMenu;
