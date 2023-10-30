import Button from "@components/common/button/Button";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummaryInfo from "@components/wallet/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import { ButtonHierarchy } from "@components/common/button/Button";
import { WalletBalanceSummaryWrapper } from "./WalletBalanceSummary.styles";
import { DEVICE_TYPE } from "@styles/media";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
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
}) => (
  <WalletBalanceSummaryWrapper>
    <span className="total-balance-title">Total Balance</span>
    <div className="container">
      <WalletBalanceSummaryInfo balanceSummaryInfo={balanceSummaryInfo} />
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
          text={"Deposit"}
          onClick={deposit}
          disabled={connected === false}
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
          text={"Withdraw"}
          onClick={withdraw}
          disabled={connected === false}
        />
      </div>
    </div>
  </WalletBalanceSummaryWrapper>
);

export default WalletBalanceSummary;
