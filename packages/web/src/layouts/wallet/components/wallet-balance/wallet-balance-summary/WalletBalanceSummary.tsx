import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceSummaryInfo, { BalanceSummaryInfo } from "./wallet-balance-summary-info/WalletBalanceSummaryInfo";

import { WalletBalanceSummaryWrapper } from "./WalletBalanceSummary.styles";
import { WalletTypeState } from "src/types/wallet.types";
import Badge from "@components/common/badge/Badge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { SocialWalletNotificationTooltip } from "@components/common/header/wallet-connector-button/wallet-connector-menu/WalletConnectorMenu";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  isSwitchNetwork: boolean;
  deposit: () => void;
  withdraw: () => void;
  breakpoint: DEVICE_TYPE;
  walletType: WalletTypeState;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
  breakpoint,
  isSwitchNetwork,
  walletType,
}) => {
  const { t } = useTranslation();

  const isConnectSocialWallet = connected && walletType.type === "SOCIAL_WALLET";

  return (
    <WalletBalanceSummaryWrapper>
      <div className="total-balance-title-wrapper">
        <span className="total-balance-title">{t("Wallet:overral.totalBal")}</span>
        {isConnectSocialWallet && (
          <Tooltip FloatingContent={<SocialWalletNotificationTooltip />} placement="top">
            <Badge text={t("Wallet:socialwallet.badge")} type="darkDefault" className="badge" />
          </Tooltip>
        )}
      </div>
      <div className="container">
        <WalletBalanceSummaryInfo balanceSummaryInfo={balanceSummaryInfo} connected={connected} />
        <div className="button-group">
          <Button
            leftIcon={<IconDownload />}
            style={{
              width: breakpoint !== DEVICE_TYPE.MOBILE ? 150 : "50%",
              hierarchy: ButtonHierarchy.Primary,
              fontType: "body9",
              padding: "10px 16px",
              gap: "8px",
            }}
            text={t("Wallet:assets.col.assetReceive")}
            onClick={deposit}
            disabled={connected === false || isSwitchNetwork}
          />
          <Button
            leftIcon={<IconUpload />}
            style={{
              width: breakpoint !== DEVICE_TYPE.MOBILE ? 150 : "50%",
              hierarchy: ButtonHierarchy.Primary,
              fontType: "body9",
              padding: "10px 16px",
              gap: "8px",
            }}
            text={t("Wallet:assets.col.assetSend")}
            onClick={withdraw}
            disabled={connected === false || isSwitchNetwork}
          />
        </div>
      </div>
    </WalletBalanceSummaryWrapper>
  );
};

export default WalletBalanceSummary;
