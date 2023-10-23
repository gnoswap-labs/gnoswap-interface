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
import { AccountModel } from "@models/account/account-model";

interface IconButtonClickProps {
  copyClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  openLinkClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickDisconnect: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButtonMaker: React.FC<IconButtonClickProps> = ({
  copyClick,
  openLinkClick,
  onClickDisconnect,
}) => {
  return (
    <>
      <IconButton onClick={copyClick}>
        <IconCopy className="action-icon" />
      </IconButton>
      <IconButton onClick={openLinkClick}>
        <IconOpenLink className="action-icon" />
      </IconButton>
      <IconButton onClick={onClickDisconnect}>
        <IconExit className="action-icon" />
      </IconButton>
    </>
  );
};

interface WalletConnectorMenuProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  disconnectWallet: () => void;
  onMenuToggle: () => void;
}

const WalletConnectorMenu: React.FC<WalletConnectorMenuProps> = ({
  account,
  connected,
  connectAdenaClient,
  disconnectWallet,
  onMenuToggle,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const balanceText = useMemo(() => `${account?.balances[0].amount} ${account?.balances[0].currency}` || "0 GNOT", [account?.balances]);

  const copyClick = () => { };

  const openLinkClick = () => { };

  const onClickDisconnect = useCallback(() => {
    disconnectWallet();
  }, [disconnectWallet]);

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
              onClickDisconnect={onClickDisconnect}
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
