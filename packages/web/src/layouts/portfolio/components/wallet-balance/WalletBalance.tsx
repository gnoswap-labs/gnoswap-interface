import React from "react";

import { PositionModel } from "@models/position/position-model";
import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { PositionRewardsResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail, { BalanceDetailInfo } from "./wallet-balance-detail/WalletBalanceDetail";
import { BalanceSummaryInfo } from "./wallet-balance-summary/wallet-balance-summary-info/WalletBalanceSummaryInfo";
import WalletBalanceSummary from "./wallet-balance-summary/WalletBalanceSummary";

import { WalletBalanceWrapper } from "./WalletBalance.styles";
import { WalletTypeState } from "src/types/wallet.types";

interface WalletBalanceProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo;
  balanceDetailInfo: BalanceDetailInfo;
  isSwitchNetwork: boolean;
  loadngTransactionClaim: boolean;
  positions: PositionModel[];
  positionRewards: PositionRewardsResponse | null;
  tokens: TokenModel[];
  tokenPrices: Record<string, TokenPriceModel>;
  walletType: WalletTypeState;

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
  positionRewards,
  tokens,
  tokenPrices,
  walletType,
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
        walletType={walletType}
      />
      <WalletBalanceDetail
        connected={connected}
        balanceDetailInfo={balanceDetailInfo}
        claimAll={claimAll}
        breakpoint={breakpoint}
        isSwitchNetwork={isSwitchNetwork}
        loadngTransactionClaim={loadngTransactionClaim}
        positions={positions}
        positionRewards={positionRewards}
        tokens={tokens}
        tokenPrices={tokenPrices}
      />
    </WalletBalanceWrapper>
  );
};

export default WalletBalance;
