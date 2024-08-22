import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconHeaderLogo from "@components/common/icons/IconHeaderLogo";
import IconSearch from "@components/common/icons/IconSearch";
import AssetReceiveModal from "@components/wallet/asset-receive-modal/AssetReceiveModal";
import { BLOCKED_PAGES } from "@constants/environment.constant";
import { HEADER_NAV, SIDE_MENU_NAV } from "@constants/header.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { DeviceSize, DEVICE_TYPE } from "@styles/media";

import NotificationButton from "./notification-button/NotificationButton";
import SearchMenuModal, { Token } from "./search-menu-modal/SearchMenuModal";
import SubMenuButton from "./sub-menu-button/SubMenuButton";
import WalletConnectorButton from "./wallet-connector-button/WalletConnectorButton";

import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavWrapper,
  DepositIconWrapper,
  HeaderContainer,
  HeaderWrapper,
  LeftSection,
  LogoLink,
  Navigation,
  RightSection,
  SearchButton,
  SearchContainer
} from "./Header.styles";

interface HeaderProps {
  pathname?: string;
  sideMenuToggle: boolean;
  onSideMenuToggle: (value: boolean) => void;
  searchMenuToggle: boolean;
  onSearchMenuToggle: () => void;
  tokens: Token[];
  isFetched: boolean;
  error: Error | null;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  breakpoint: DEVICE_TYPE;
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
  disconnectWallet: () => void;
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  loadingConnect: string;
  mostLiquidity: Token[];
  popularTokens: Token[];
  recents: Token[];
  moveTokenPage: (path: string) => void;
  movePoolPage: (path: string) => void;
  gnotBalance?: number | null;
  isLoadingGnotBalance?: boolean;
  gnotToken?: ITokenResponse;
  avgBlockTime: number;
}

const Header: React.FC<HeaderProps> = ({
  pathname = "/",
  sideMenuToggle,
  onSideMenuToggle,
  searchMenuToggle,
  onSearchMenuToggle,
  tokens,
  isFetched,
  search,
  keyword,
  breakpoint,
  account,
  connected,
  connectAdenaClient,
  themeKey,
  disconnectWallet,
  switchNetwork,
  isSwitchNetwork,
  loadingConnect,
  mostLiquidity,
  popularTokens,
  recents,
  moveTokenPage,
  movePoolPage,
  gnotBalance,
  isLoadingGnotBalance,
  gnotToken,
  avgBlockTime,
}) => {
  const { width } = useWindowSize();
  const router = useCustomRouter();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const { t } = useTranslation();

  const navigationItems = useMemo(() => {
    // Make path by page name
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);
    if (blockedPaths.length > 0) {
      return [...HEADER_NAV, ...SIDE_MENU_NAV].filter(
        item => !blockedPaths.includes(item.path),
      );
    }
    return HEADER_NAV.filter(item => !blockedPaths.includes(item.path));
  }, []);

  const changeTokenDeposit = useCallback(() => {
    setIsShowDepositModal(true);
  }, []);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  usePreventScroll(isShowDepositModal);

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LeftSection>
            <span className="link" onClick={() => router.replace("/")}>
              <LogoLink>
                <IconHeaderLogo className="header-main-logo" />
              </LogoLink>
            </span>
            <Navigation>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <React.Fragment>
                  <ul>
                    {navigationItems.map(item => (
                      <li
                        key={t(item.title)}
                        className={
                          pathname === item.path ||
                          (item?.subPath || []).some(_ => pathname.includes(_))
                            ? "selected"
                            : ""
                        }
                      >
                        <span
                          className="link"
                          onClick={() => router.push(item.path)}
                        >
                          {t(item.title)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <SubMenuButton
                    sideMenuToggle={sideMenuToggle}
                    onSideMenuToggle={onSideMenuToggle}
                  />
                </React.Fragment>
              )}
            </Navigation>
          </LeftSection>
          <RightSection>
            <SearchContainer>
              <SearchButton onClick={onSearchMenuToggle}>
                <IconSearch className="search-icon" />
              </SearchButton>
              {connected && width > DeviceSize[DEVICE_TYPE.TABLET_S] && (
                <Button
                  leftIcon={
                    <DepositIconWrapper>
                      <IconDownload />
                    </DepositIconWrapper>
                  }
                  text={t("HeaderFooter:receive")}
                  onClick={() => changeTokenDeposit()}
                  style={{
                    hierarchy: ButtonHierarchy.Primary,
                    fontType: "p1",
                    padding: "10px 16px 10px 14px",
                    gap: "8px",
                  }}
                />
              )}
              <WalletConnectorButton
                account={account}
                connected={connected}
                connectAdenaClient={connectAdenaClient}
                themeKey={themeKey}
                disconnectWallet={disconnectWallet}
                switchNetwork={switchNetwork}
                isSwitchNetwork={isSwitchNetwork}
                loadingConnect={loadingConnect}
                gnotBalance={gnotBalance}
                isLoadingGnotBalance={isLoadingGnotBalance}
                gnotToken={gnotToken}
              />
            </SearchContainer>

            <NotificationButton breakpoint={breakpoint} />
          </RightSection>
        </HeaderContainer>
        {breakpoint === DEVICE_TYPE.MOBILE && (
          <BottomNavWrapper>
            <BottomNavContainer>
              {navigationItems.map(item => (
                <BottomNavItem
                  key={t(item.title)}
                  className={
                    pathname === item.path ||
                    (item.subPath || []).some(_ => pathname.includes(_))
                      ? "selected"
                      : ""
                  }
                >
                  <Link href={item.path}>{t(item.title)}</Link>
                </BottomNavItem>
              ))}
              <SubMenuButton
                sideMenuToggle={sideMenuToggle}
                onSideMenuToggle={onSideMenuToggle}
              />
            </BottomNavContainer>
          </BottomNavWrapper>
        )}
        {searchMenuToggle && (
          <SearchMenuModal
            onSearchMenuToggle={onSearchMenuToggle}
            search={search}
            keyword={keyword}
            tokens={tokens}
            isFetched={isFetched}
            breakpoint={breakpoint}
            mostLiquidity={mostLiquidity}
            popularTokens={popularTokens}
            recents={recents}
            placeholder={t("common:selectPairBtn.modal.searchInputPlaceholder")}
            moveTokenPage={moveTokenPage}
            movePoolPage={movePoolPage}
          />
        )}
      </HeaderWrapper>

      {isShowDepositModal && (
        <AssetReceiveModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={undefined}
          avgBlockTime={avgBlockTime}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
    </>
  );
};
export default Header;
