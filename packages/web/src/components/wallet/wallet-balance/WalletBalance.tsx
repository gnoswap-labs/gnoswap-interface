import { css } from "@emotion/react";

import { BalanceSummaryInfo, BalacneDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import WalletBalanceSummary from "../wallet-balance-summary/WalletBalanceSummary";
import WalletBalanceDetail from "../wallet-balance-detail/WalletBalanceDetail";

interface WalletBalanceProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo | undefined;
  balanceDetailInfo: BalacneDetailInfo | undefined;
  deposit: () => void;
  withdraw: () => void;
  earn: () => void;
};

const WalletBalance: React.FC<WalletBalanceProps> = ({
  connected,
  balanceSummaryInfo,
  balanceDetailInfo,
  deposit,
  withdraw,
  earn
}) => (
  <div
    css={css`
      border: 1px solid green;
    `}
  >
    <WalletBalanceSummary
      connected={connected}
      balanceSummaryInfo={balanceSummaryInfo}
      deposit={deposit}
      withdraw={withdraw}
      earn={earn}
    />
    <WalletBalanceDetail
      connected={connected}
      balanceDetailInfo={balanceDetailInfo}
    />
  </div>
);

export default WalletBalance;
