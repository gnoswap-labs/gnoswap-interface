import React, { useCallback, useEffect, useMemo, useRef } from "react";
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
import { formatAddress } from "@utils/string-utils";
import ThemeModeContainer from "@containers/theme-mode-container/ThemeModeContainer";
import { AccountInfo } from "@common/clients/wallet-client/protocols";

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
  account: AccountInfo | null;
  connected: boolean;
  connectAdenaClient: () => void;
  onMenuToggle: () => void;
}

const WalletConnectorMenu: React.FC<WalletConnectorMenuProps> = ({
  account,
  connected,
  connectAdenaClient,
  onMenuToggle,
}) => {
  const balanceText = useMemo(() => account?.coins || "0 GNOT", [account?.coins]);
  const copyClick = () => { };
  const openLinkClick = () => { };
  const exitClick = () => { };
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

  const connect = useCallback(() => {
    connectAdenaClient();
  }, [connectAdenaClient]);

  return (
    <WalletConnectorMenuWrapper ref={menuRef} width={window?.innerWidth}>
      {connected ? (
        <div className="button-container">
          <MenuHeader>
            <IconAdenaLogo />
            <span className="user-address">
              {formatAddress(account?.address || "")}
            </span>
            <IconButtonMaker
              copyClick={copyClick}
              openLinkClick={openLinkClick}
              exitClick={exitClick}
            />
          </MenuHeader>
          <AmountInfoBox>{balanceText}</AmountInfoBox>
        </div>
      ) : (
        <div className="button-container">
          <Button
            text="Connect Wallet"
            onClick={connect}
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
