import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceSummaryInfoWrapper } from "./WalletBalanceSummaryInfo.styles";
import PulseSkeleton from "@components/common/pulse-skeleton/PulseSkeleton";

interface WalletBalanceSummaryInfoProps {
  balanceSummaryInfo: BalanceSummaryInfo;
  connected: boolean;
}
const WalletBalanceSummaryInfo: React.FC<WalletBalanceSummaryInfoProps> = ({
  balanceSummaryInfo,
}) => {
  // const changeRate = Number(balanceSummaryInfo.changeRate.slice(0, -1)) || 0;

  return (
    <WalletBalanceSummaryInfoWrapper>
      <PulseSkeleton loading={balanceSummaryInfo.loading} w="300px" h={20} className="amount">
        <span className="amount">{balanceSummaryInfo.amount}</span>
      </PulseSkeleton>
      {/* <span
        className={`${
          changeRate === 0
            ? "change-rate"
            : changeRate > 0
            ? "positive"
            : "negative"
        }`}
      >
        {balanceSummaryInfo.changeRate}
      </span> */}
    </WalletBalanceSummaryInfoWrapper>
  );
};

export default WalletBalanceSummaryInfo;
