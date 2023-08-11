import Button from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummaryInfo from "@components/wallet/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import { ButtonHierarchy } from "@components/common/button/Button";
import { WalletBalanceSummaryWrapper } from "./WalletBalanceSummary.styles";
import { DeviceSize } from "@styles/media";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  deposit: () => void;
  withdraw: () => void;
  windowSize: number;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
  windowSize,
}) => (
  <WalletBalanceSummaryWrapper>
    <span className="total-balance-title">Total Balance</span>
    <div className="container">
      <WalletBalanceSummaryInfo balanceSummaryInfo={balanceSummaryInfo} />
      <div className="button-group">
        <Button
          style={{
            width: windowSize > DeviceSize.mobile ? 150 : 304,
            hierarchy: ButtonHierarchy.Primary,
            fontType: "body9",
            padding: "10px 16px",
          }}
          text={"Deposit"}
          leftIcon={<IconDownload className="wallet-button-icon" />}
          onClick={deposit}
          disabled={connected === false}
        />
        <Button
          style={{
            width: windowSize > DeviceSize.mobile ? 150 : 304,
            hierarchy: ButtonHierarchy.Primary,
            fontType: "body9",
            padding: "10px 16px",
          }}
          text={"Withdraw"}
          leftIcon={<IconUpload className="wallet-button-icon" />}
          onClick={withdraw}
          disabled={connected === false}
        />
      </div>
    </div>
  </WalletBalanceSummaryWrapper>
);

export default WalletBalanceSummary;
