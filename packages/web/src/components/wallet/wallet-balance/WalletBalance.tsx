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
  isSwitchNetwork: boolean;

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
  isSwitchNetwork,
}) => (
  <WalletBalanceWrapper>
    <WalletBalanceSummary
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      deposit={deposit}
      withdraw={withdraw}
      breakpoint={breakpoint}
      isSwitchNetwork={isSwitchNetwork}
    />
    <WalletBalanceDetail
      connected={connected}
      balanceDetailInfo={balanceDetailInfo}
      claimAll={claimAll}
      breakpoint={breakpoint}
      isSwitchNetwork={isSwitchNetwork}
    />
  </WalletBalanceWrapper>
);

export default WalletBalance;
