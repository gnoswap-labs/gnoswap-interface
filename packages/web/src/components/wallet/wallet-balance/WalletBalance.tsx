import {
  BalanceSummaryInfo,
  BalanceDetailInfo,
} from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummary from "@components/wallet/wallet-balance-summary/WalletBalanceSummary";
import WalletBalanceDetail from "@components/wallet/wallet-balance-detail/WalletBalanceDetail";
import { WalletBalanceWrapper } from "./WalletBalance.styles";
import { DEVICE_TYPE } from "@styles/media";

interface WalletBalanceProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  balanceDetailInfo: BalanceDetailInfo;
  deposit: () => void;
  withdraw: () => void;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  connected,
  balanceSummaryInfo,
  balanceDetailInfo,
  deposit,
  withdraw,
  claimAll,
  breakpoint,
}) => (
  <WalletBalanceWrapper>
    <WalletBalanceSummary
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      deposit={deposit}
      withdraw={withdraw}
      breakpoint={breakpoint}
    />
    <WalletBalanceDetail
      connected={connected}
      balanceDetailInfo={balanceDetailInfo}
      claimAll={claimAll}
      breakpoint={breakpoint}
    />
  </WalletBalanceWrapper>
);

export default WalletBalance;
