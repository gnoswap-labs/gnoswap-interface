import {
  SHAPE_TYPES,
  skeletonTotalBalance,
} from "@constants/skeleton.constant";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceSummaryInfoWrapper } from "./WalletBalanceSummaryInfo.styles";

interface WalletBalanceSummaryInfoProps {
  balanceSummaryInfo: BalanceSummaryInfo;
  connected: boolean;
}
const WalletBalanceSummaryInfo: React.FC<WalletBalanceSummaryInfoProps> = ({
  balanceSummaryInfo,
  connected,
}) => {
  // const changeRate = Number(balanceSummaryInfo.changeRate.slice(0, -1)) || 0;

  return (
    <WalletBalanceSummaryInfoWrapper>
      {connected ? (
        balanceSummaryInfo.loading ? (
          <span
            css={skeletonTotalBalance("300px", SHAPE_TYPES.ROUNDED_SQUARE, 2)}
          />
        ) : (
          <span className="amount">{balanceSummaryInfo.amount}</span>
        )
      ) : (
        <span className="amount">$0</span>
      )}
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
