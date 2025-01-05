import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceSummaryInfo, { BalanceSummaryInfo } from "./wallet-balance-summary-info/WalletBalanceSummaryInfo";

import { WalletBalanceSummaryWrapper } from "./WalletBalanceSummary.styles";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  isSwitchNetwork: boolean;
  deposit: () => void;
  withdraw: () => void;
  breakpoint: DEVICE_TYPE;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
  breakpoint,
  isSwitchNetwork,
}) => {
  const { t } = useTranslation();

  return (
    <WalletBalanceSummaryWrapper>
      <div className="total-balance-title-wrapper">
        <span className="total-balance-title">{t("Wallet:overral.totalBal")}</span>
        <div className="badge">Social Account Wallet</div>
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
