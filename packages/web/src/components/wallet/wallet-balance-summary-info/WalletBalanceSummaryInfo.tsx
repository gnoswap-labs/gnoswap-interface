import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceSummaryInfoWrapper } from "./WalletBalanceSummaryInfo.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface WalletBalanceSummaryInfoProps {
  balanceSummaryInfo: BalanceSummaryInfo;
  connected: boolean;
}
const WalletBalanceSummaryInfo: React.FC<WalletBalanceSummaryInfoProps> = ({
  balanceSummaryInfo,
}) => {
  return (
    <WalletBalanceSummaryInfoWrapper>
      {balanceSummaryInfo.loading && (
        <div className="loading-wrapper">
          <div
            css={pulseSkeletonStyle({ w: "200px", h: 20 })}
            className="amount"
          />
        </div>
      )}

      {!balanceSummaryInfo.loading && (
        <span className="amount">{balanceSummaryInfo.amount}</span>
      )}
    </WalletBalanceSummaryInfoWrapper>
  );
};

export default WalletBalanceSummaryInfo;
