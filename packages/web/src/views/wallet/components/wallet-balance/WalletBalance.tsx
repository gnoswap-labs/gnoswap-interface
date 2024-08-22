import React from "react";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail, {
  BalanceDetailInfo,
} from "./wallet-balance-detail/WalletBalanceDetail";
import { BalanceSummaryInfo } from "./wallet-balance-summary/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import WalletBalanceSummary from "./wallet-balance-summary/WalletBalanceSummary";

import { WalletBalanceWrapper } from "./WalletBalance.styles";

interface WalletBalanceProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  balanceDetailInfo: BalanceDetailInfo;
  isSwitchNetwork: boolean;
  loadngTransactionClaim: boolean;

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
  loadngTransactionClaim,
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
      loadngTransactionClaim={loadngTransactionClaim}
    />
  </WalletBalanceWrapper>
);

export default WalletBalance;
