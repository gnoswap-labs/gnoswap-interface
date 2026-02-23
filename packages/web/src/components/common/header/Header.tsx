import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconHeaderLogo from "@components/common/icons/IconHeaderLogo";
import IconSearch from "@components/common/icons/IconSearch";
import AssetReceiveModal from "@components/wallet/asset-receive-modal/AssetReceiveModal";
import { BLOCKED_PAGES } from "@constants/environment.constant";
import { HEADER_NAV } from "@constants/header.constant";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { DeviceSize, DEVICE_TYPE } from "@styles/media";
import useScrollData from "@hooks/common/use-scroll-data";
import { WalletTypeState } from "src/types/wallet.types";
import useNavigation from "@hooks/common/use-navigation";
import { TABLET_HIDDEN_NAV_PATHS } from "@constants/page.constant";

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
  SearchContainer,
} from "./Header.styles";
import SettingUiButton from "./setting-ui-button/SettingUiButton";
import { useAccountChange } from "@hooks/wallet/data/use-account-change";
import { useReferral } from "@hooks/common/use-referral";
import { FaucetButton } from "./faucet-button/FaucetButton";
import { useFaucetGRC20 } from "@hooks/faucet/use-faucet-grc20";
import { useFaucetNative } from "@hooks/faucet/use-faucet-native";

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
  walletType: WalletTypeState;
  displayAddress: string;
  resetWeb3authSession: () => void;
}

const HEADER_NAVIGATION_LAYOUT_COLLAPSE_WIDTH = 1300; // 1300px threshold: a threshold to prevent UI layout from being warped
const HEADER_MOBILE_BREAKPOINT = 800;

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
  walletType,
  displayAddress,
  resetWeb3authSession,
}) => {
  const { width } = useWindowSize();
  const isMobileLayout = width <= HEADER_MOBILE_BREAKPOINT;

  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const { t } = useTranslation();
  const { saveCurrentScrollHeight } = useScrollData();
  const { handleNavigation } = useNavigation();
  const { removeReferrerFromUrl, refreshReferralData } = useReferral();

  const { isSupportedFaucetGRC20 } = useFaucetGRC20();
  const { isSupportedFaucetNative } = useFaucetNative();

  useAccountChange({
    onAccountChange(prevAccount, currentAccount) {
      if (prevAccount !== null && currentAccount !== null && prevAccount.address !== currentAccount.address) {
        removeReferrerFromUrl();
      }
      refreshReferralData();
    },
  });

  const isCollapseNav = useMemo(() => {
    return width < HEADER_NAVIGATION_LAYOUT_COLLAPSE_WIDTH;
  }, [width]);

  const navigationItems = useMemo(() => {
    const blockedPaths = BLOCKED_PAGES.map(page => "/" + page);
    if (isCollapseNav) {
      return HEADER_NAV.filter(
        item => !blockedPaths.includes(item.path) && !TABLET_HIDDEN_NAV_PATHS.includes(item.path),
      );
    }

    return HEADER_NAV.filter(item => !blockedPaths.includes(item.path));
  }, [isCollapseNav]);

  const changeTokenDeposit = useCallback(() => {
    setIsShowDepositModal(true);
  }, []);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  const showFaucetButton = useMemo(() => {
    return connected && width > DeviceSize[DEVICE_TYPE.TABLET_M] && (isSupportedFaucetGRC20 || isSupportedFaucetNative);
  }, [connected, width, isSupportedFaucetGRC20, isSupportedFaucetNative]);

  const showReceiveButton = useMemo(() => {
    return connected && width > DeviceSize[DEVICE_TYPE.TABLET_M] && !isSupportedFaucetGRC20 && !isSupportedFaucetNative;
  }, [connected, width, isSupportedFaucetGRC20, isSupportedFaucetNative]);

  usePreventScroll(isShowDepositModal);

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LeftSection>
            <Link className="link" href={"/"} onClick={e => handleNavigation(e, "/")}>
              <LogoLink>
                <IconHeaderLogo className="header-main-logo" />
              </LogoLink>
            </Link>
            <Navigation>
              {!isMobileLayout && (
                <React.Fragment>
                  <ul>
                    {navigationItems.map(item => (
                      <Link href={item.path} key={item.title} onClick={e => handleNavigation(e, item.path)}>
                        <li
                          key={t(item.title)}
                          className={
                            pathname === item.path || (item?.subPath || []).some(_ => pathname.includes(_))
                              ? "selected"
                              : ""
                          }
                        >
                          <span className="link" onClick={() => saveCurrentScrollHeight(window?.location?.pathname)}>
                            {t(item.title)}
                          </span>
                        </li>
                      </Link>
                    ))}
                  </ul>
                  <SubMenuButton
                    onNavigation={handleNavigation}
                    sideMenuToggle={sideMenuToggle}
                    onSideMenuToggle={onSideMenuToggle}
                    isCollapseNav={isCollapseNav}
                    isBottomNav={false}
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
              {showReceiveButton && (
                <Button
                  leftIcon={
                    <DepositIconWrapper>
                      <IconDownload />
                    </DepositIconWrapper>
                  }
                  text={t("HeaderFooter:receive")}
                  onClick={changeTokenDeposit}
                  style={{
                    hierarchy: ButtonHierarchy.Primary,
                    fontType: "p1",
                    padding: "10px 16px 10px 14px",
                    gap: "8px",
                  }}
                />
              )}
              {showFaucetButton && <FaucetButton />}
              <WalletConnectorButton
                account={account}
                breakpoint={breakpoint}
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
                walletType={walletType}
                displayAddress={displayAddress}
                resetWeb3authSession={resetWeb3authSession}
              />
            </SearchContainer>

            {connected && <NotificationButton breakpoint={breakpoint} />}

            <SettingUiButton />
          </RightSection>
        </HeaderContainer>
        {isMobileLayout && (
          <BottomNavWrapper>
            <BottomNavContainer>
              {navigationItems.map(item => (
                <BottomNavItem
                  key={t(item.title)}
                  className={
                    pathname === item.path || (item.subPath || []).some(_ => pathname.includes(_)) ? "selected" : ""
                  }
                >
                  <Link href={item.path} onClick={e => handleNavigation(e, item.path)}>
                    {t(item.title)}
                  </Link>
                </BottomNavItem>
              ))}
              <SubMenuButton
                sideMenuToggle={sideMenuToggle}
                onSideMenuToggle={onSideMenuToggle}
                isCollapseNav={isCollapseNav}
                onNavigation={handleNavigation}
                isBottomNav={true}
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
