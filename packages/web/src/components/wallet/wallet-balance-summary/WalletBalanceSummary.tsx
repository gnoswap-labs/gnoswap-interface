import Button from "@components/common/button/Button";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummaryInfo from "@components/wallet/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import { ButtonHierarchy } from "@components/common/button/Button";
import { WalletBalanceSummaryWrapper } from "./WalletBalanceSummary.styles";
import { DEVICE_TYPE } from "@styles/media";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { useTranslation } from "react-i18next";

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
      <span className="total-balance-title">
        {t("Wallet:overral.totalBal")}
      </span>
      <div className="container">
        <WalletBalanceSummaryInfo
          balanceSummaryInfo={balanceSummaryInfo}
          connected={connected}
        />
        <div className="button-group">
          <Button
            leftIcon={breakpoint !== DEVICE_TYPE.MOBILE && <IconDownload />}
            style={{
              width: breakpoint !== DEVICE_TYPE.MOBILE ? 150 : "50%",
              hierarchy: ButtonHierarchy.Primary,
              fontType: "body9",
              padding: "10px 16px",
              gap: "8px",
            }}
            text={t("Wallet:overral.btn.deposit")}
            onClick={deposit}
            disabled={connected === false || isSwitchNetwork}
          />
          <Button
            leftIcon={breakpoint !== DEVICE_TYPE.MOBILE && <IconUpload />}
            style={{
              width: breakpoint !== DEVICE_TYPE.MOBILE ? 150 : "50%",
              hierarchy: ButtonHierarchy.Primary,
              fontType: "body9",
              padding: "10px 16px",
              gap: "8px",
            }}
            text={t("Wallet:overral.btn.withdraw")}
            onClick={withdraw}
            disabled={connected === false || isSwitchNetwork}
          />
        </div>
      </div>
    </WalletBalanceSummaryWrapper>
  );
};

export default WalletBalanceSummary;
