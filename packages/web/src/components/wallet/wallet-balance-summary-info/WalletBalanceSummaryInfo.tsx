import {
  SHAPE_TYPES,
  skeletonTotalBalance,
} from "@constants/skeleton.constant";
import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceSummaryInfoWrapper } from "./WalletBalanceSummaryInfo.styles";

interface WalletBalanceSummaryInfoProps {
  balanceSummaryInfo: BalanceSummaryInfo;
}
const WalletBalanceSummaryInfo: React.FC<WalletBalanceSummaryInfoProps> = ({
  balanceSummaryInfo,
}) => {
  // const changeRate = Number(balanceSummaryInfo.changeRate.slice(0, -1)) || 0;

  return (
    <WalletBalanceSummaryInfoWrapper>
      {balanceSummaryInfo.loading ? (
        <span css={skeletonTotalBalance("150px", SHAPE_TYPES.ROUNDED_SQUARE)} />
      ) : (
        <span className="amount">{balanceSummaryInfo.amount}</span>
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

// const LoadingText = () => {
//   return (
//     <LoadingTextWrapper className="loading-text-wrapper">
//       <span css={skeletonTokenDetail("150px", SHAPE_TYPES.ROUNDED_SQUARE)} />
//     </LoadingTextWrapper>
//   );
// };
