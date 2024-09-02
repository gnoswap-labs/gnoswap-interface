import React from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
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
  positions: PoolPositionModel[];
  tokenPrices: Record<string, TokenPriceModel>;

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
  positions,
  tokenPrices,
}) => {
  return (
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
        positions={positions}
        tokenPrices={tokenPrices}
      />
    </WalletBalanceWrapper>
  );
};

export default WalletBalance;
