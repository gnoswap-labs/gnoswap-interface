import Button from "@components/common/button/Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import IconMoveToInbox from "@components/common/icons/IconMoveToInbox";
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
  earn: () => void;
}

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
  earn,
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
        leftIcon={<IconDownload />}
        onClick={deposit}
        disabled={!connected}
      />
      <Button
        style={defaultWalletButtonStyle}
        text={"Withdraw"}
        leftIcon={<IconUpload />}
        onClick={withdraw}
        disabled={!connected}
      />
      <Button
        style={defaultWalletButtonStyle}
        text={"Earn"}
        leftIcon={<IconMoveToInbox />}
        onClick={earn}
        disabled={!connected}
      />
    </WalletButtonGroup>
  </WalletBalanceSummaryWrapper>
);

export default WalletBalanceSummary;
