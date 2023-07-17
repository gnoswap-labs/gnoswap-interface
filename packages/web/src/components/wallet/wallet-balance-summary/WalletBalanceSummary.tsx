import Button from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummaryInfo from "@components/wallet/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import {
  defaultWalletButtonStyle,
  BalanceInfoWrapper,
  WalletBalanceSummaryWrapper,
  WalletButtonGroup,
} from "./WalletBalanceSummary.styles";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  deposit: () => void;
  withdraw: () => void;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
}) => (
  <WalletBalanceSummaryWrapper>
    <BalanceInfoWrapper>
      <span className="title">Total Balance</span>
      <WalletBalanceSummaryInfo balanceSummaryInfo={balanceSummaryInfo} />
    </BalanceInfoWrapper>

    <WalletButtonGroup>
      <Button
        style={defaultWalletButtonStyle}
        text={"Deposit"}
        leftIcon={<IconDownload className="wallet-button-icon" />}
        onClick={deposit}
        disabled={connected === false}
      />
      <Button
        style={defaultWalletButtonStyle}
        text={"Withdraw"}
        leftIcon={<IconUpload className="wallet-button-icon" />}
        onClick={withdraw}
        disabled={connected === false}
      />
    </WalletButtonGroup>
  </WalletBalanceSummaryWrapper>
);

export default WalletBalanceSummary;
