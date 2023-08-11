import {
  BalanceSummaryInfo,
  BalanceDetailInfo,
} from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummary from "@components/wallet/wallet-balance-summary/WalletBalanceSummary";
import WalletBalanceDetail from "@components/wallet/wallet-balance-detail/WalletBalanceDetail";
import { WalletBalanceWrapper } from "./WalletBalance.styles";

interface WalletBalanceProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  balanceDetailInfo: BalanceDetailInfo;
  deposit: () => void;
  withdraw: () => void;
  claimAll: () => void;
  windowSize: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  connected,
  balanceSummaryInfo,
  balanceDetailInfo,
  deposit,
  withdraw,
  claimAll,
  windowSize,
}) => (
  <WalletBalanceWrapper>
    <WalletBalanceSummary
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      deposit={deposit}
      withdraw={withdraw}
      windowSize={windowSize}
    />
    <WalletBalanceDetail
      connected={connected}
      balanceDetailInfo={balanceDetailInfo}
      claimAll={claimAll}
      windowSize={windowSize}
    />
  </WalletBalanceWrapper>
);

export default WalletBalance;
