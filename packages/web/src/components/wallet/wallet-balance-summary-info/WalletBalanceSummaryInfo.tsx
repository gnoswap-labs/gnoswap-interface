import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceSummaryInfoWrapper } from "./WalletBalanceSummaryInfo.styles";

interface WalletBalanceSummaryInfoProps {
  balanceSummaryInfo: BalanceSummaryInfo;
}
const WalletBalanceSummaryInfo: React.FC<WalletBalanceSummaryInfoProps> = ({
  balanceSummaryInfo,
}) => {
  return (
    <WalletBalanceSummaryInfoWrapper>
      <span className="amount">{balanceSummaryInfo.amount}</span>
      <span className="change-rate">{balanceSummaryInfo.changeRate}</span>
    </WalletBalanceSummaryInfoWrapper>
  );
};

export default WalletBalanceSummaryInfo;
