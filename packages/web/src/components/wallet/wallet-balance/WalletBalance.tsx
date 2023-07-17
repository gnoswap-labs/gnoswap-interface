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
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  connected,
  balanceSummaryInfo,
  balanceDetailInfo,
  deposit,
  withdraw,
  claimAll,
}) => (
  <WalletBalanceWrapper>
    <WalletBalanceSummary
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      deposit={deposit}
      withdraw={withdraw}
    />
    <WalletBalanceDetail
      connected={connected}
      balanceDetailInfo={balanceDetailInfo}
      claimAll={claimAll}
    />
  </WalletBalanceWrapper>
);

export default WalletBalance;
