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
  // const changeRate = Number(balanceSummaryInfo.changeRate.slice(0, -1)) || 0;

  return (
    <WalletBalanceSummaryInfoWrapper>
      {balanceSummaryInfo.loading && <div css={pulseSkeletonStyle({ w: "200px", h: 20 })} className="amount"/>}

      {!balanceSummaryInfo.loading && <span className="amount">{balanceSummaryInfo.amount}</span>}
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
